import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CONTACT, EMAIL_PATTERN } from '@/data/site';
import { formatINR, getWork, isBuyable, priceValue } from '@/data/works';
import { sendForm } from '@/utils/sendForm';
import { payWithRazorpay } from '@/utils/razorpay';
import { useBag } from '@/context/BagContext';
import { gsap, canAnimate } from '@/motion/gsap';
import { useMotionApi } from '@/motion/MotionContext';
import PageTop from '@/components/sections/PageTop';
import { Accent, Line } from '@/components/ui/Typography';
import OrderSummary from './OrderSummary';
import { ChooseStep, DetailsStep, OrderDone, ReviewStep } from './steps';

const STEPS = ['Choose', 'Your details', 'Review & pay'];
const EMPTY_FORM = { name: '', email: '', phone: '', address: '', city: '', state: '', pin: '', note: '' };
const PAY_ERROR = `The payment couldn’t be started. Please try again in a minute, or write to me at ${CONTACT.email}.`;
/* a Razorpay order is reused if the buyer closes the window and tries again, but only while
   the paintings are still held for them (20 min on the server) */
const SESSION_MINUTES = 15;

const PHONE_PATTERN = /^[6-9]\d{9}$/;
/* "+91 98765-43210" → "9876543210" */
const cleanPhone = (p) => p.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');

const FIELD_MESSAGES = {
  name: 'Add your full name.',
  email: 'Add a valid email, like name@example.com.',
  phone: 'Add a 10-digit mobile number for the courier.',
  address: 'Add the street address.',
  city: 'Add the city.',
  state: 'Add the state.',
  pin: 'Add a 6-digit PIN code.',
};

function validate(f) {
  const errors = {};
  if (!f.name.trim()) errors.name = FIELD_MESSAGES.name;
  if (!f.email.trim()) errors.email = 'Add your email for your order confirmation.';
  else if (!EMAIL_PATTERN.test(f.email.trim())) errors.email = 'Add the rest of your email, like name@example.com.';
  if (!PHONE_PATTERN.test(cleanPhone(f.phone))) errors.phone = FIELD_MESSAGES.phone;
  if (!f.address.trim()) errors.address = FIELD_MESSAGES.address;
  if (!f.city.trim()) errors.city = FIELD_MESSAGES.city;
  if (!f.state.trim()) errors.state = FIELD_MESSAGES.state;
  if (!/^[1-9]\d{5}$/.test(f.pin.trim())) errors.pin = FIELD_MESSAGES.pin;
  return errors;
}

/* an error whose message is written for the buyer; `taken` / `fields` say what to fix */
const userError = (message, extra = {}) => Object.assign(new Error(message), { userFacing: true, ...extra });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* fetch JSON with a time limit; resolves to { res, out } or { res: null } when the network fails */
async function postJson(url, body, ms = 20000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctrl.signal });
    return { res, out: await res.json().catch(() => ({})) };
  } catch {
    return { res: null, out: {} };
  } finally {
    clearTimeout(timer);
  }
}

/* 1 · /api/order prices the works, holds them while you pay, and opens a Razorpay order */
async function startCheckout(bag, form, replaces) {
  const { res, out } = await postJson('/api/order', { works: bag, customer: { ...form, phone: cleanPhone(form.phone) }, replaces });
  if (!res) throw userError('Couldn’t reach the shop. Check your connection and try again.');
  if (res.status === 409) throw userError(out.error || 'Something in your order is no longer available.', { taken: out.taken || [] });
  if (res.status === 422) throw userError(out.error || 'Please check your details.', { fields: out.fields || [] });
  if ([429, 503].includes(res.status) && out.error) throw userError(out.error);
  if (!res.ok || !out.razorpayOrderId) throw new Error(`checkout ${res.status}`);
  return out;
}

/* 3 · /api/verify checks the payment signature and confirms the order. Retries a few times if the
   network or server hiccups; Razorpay's webhook confirms it on the server anyway, so this never throws. */
async function confirmPayment(orderId, paid) {
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt) await wait(1500 * attempt);
    const { res, out } = await postJson('/api/verify', { orderId, ...paid }, 30000);
    if (res?.ok) {
      return { confirmed: out.status === 'paid', notified: Boolean(out.notified), shiprocket: out.shiprocket, problem: out.problem, lost: out.lost || [] };
    }
    if (res && res.status < 500) break; // a real "no", not a hiccup
  }
  return { confirmed: false, notified: false, lost: [] };
}

/* Choose → details → review & pay → paid. The selection is the bag, limited to works that can be bought online. */
export default function OrderPage() {
  const { bag, add, toggle, remove, removeMany, dropped, clearDropped } = useBag();
  const [params] = useSearchParams();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [pickError, setPickError] = useState(false);
  const [ack, setAck] = useState(false);
  const [ackError, setAckError] = useState(false);
  const [phase, setPhase] = useState(null); // null · 'starting' · 'paying' · 'confirming'
  const [payError, setPayError] = useState(null);
  const [notice, setNotice] = useState(null); // why something left the order (shown on step 1)
  const [paid, setPaid] = useState(null); // { orderId, email, works, confirmed, lost }
  const checkout = useRef(null); // the open Razorpay order, reused if the buyer closes the window and tries again
  const panelRef = useRef(null);
  const alive = useRef(true);
  const motion = useMotionApi();

  /* arrive with the work picked on its page (the cart itself only ever holds buyable works) */
  const picked = params.get('work');
  const [pickedOff, setPickedOff] = useState(null);
  useEffect(() => {
    if (!picked) return;
    const w = getWork(picked);
    if (w && isBuyable(w)) add(picked);
    else if (w) setPickedOff(w.title);
  }, [picked, add]);

  /* works that sold since they were added left the cart: say so here, once */
  const [soldOff] = useState(dropped);
  useEffect(() => {
    clearDropped();
  }, [clearDropped]);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  /* the cart emptied while on a later step (removed here or in another tab): back to choosing */
  useEffect(() => {
    if (!bag.length && (step === 2 || step === 3) && !phase) {
      setStep(1);
      setPickError(true);
    }
  }, [bag.length, step, phase]);

  /* each step settles in where the last one stood */
  const firstStep = useRef(true);
  useEffect(() => {
    if (firstStep.current) {
      firstStep.current = false;
      return;
    }
    const panel = panelRef.current;
    const top = panel.getBoundingClientRect().top + window.scrollY - 120;
    if (window.scrollY > top) window.scrollTo(0, Math.max(0, top));
    if (canAnimate()) gsap.fromTo(panel.children, { y: 32, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.06, ease: 'expo.out', clearProps: 'all' });
    motion.current?.refresh();
  }, [step, motion]);

  /* focus the first field that needs attention */
  useEffect(() => {
    if (Object.keys(errors).length) panelRef.current.querySelector('[aria-invalid="true"]')?.focus();
  }, [errors]);

  const toDetails = () => {
    if (!bag.length) return setPickError(true);
    setStep(2);
  };
  const toReview = (e) => {
    e.preventDefault();
    if (!bag.length) {
      setPickError(true);
      return setStep(1);
    }
    const found = validate(form);
    setErrors(found);
    if (!Object.keys(found).length) {
      setPayError(null);
      setStep(3);
    }
  };

  const pay = async (e) => {
    e.preventDefault();
    if (phase) return;
    if (!bag.length) {
      setPickError(true);
      return setStep(1);
    }
    if (!ack) return setAckError(true);
    setPayError(null);
    const botcheck = e.currentTarget.elements.botcheck?.checked;
    const ids = [...bag];
    const works = ids.map(getWork).filter(Boolean);
    const total = works.reduce((s, w) => s + priceValue(w), 0);
    const sig = JSON.stringify([ids, form]);

    try {
      /* 1 · start (or reopen) the checkout */
      setPhase('starting');
      const open = checkout.current;
      let session = open?.sig === sig && Date.now() - open.at < SESSION_MINUTES * 60 * 1000 ? open : null;
      if (!session) {
        session = { sig, at: Date.now(), ...(await startCheckout(ids, form, open?.orderId)) };
        checkout.current = session;
      }

      /* 2 · Razorpay's window: UPI QR code, UPI apps, cards, netbanking */
      setPhase('paying');
      let payment;
      try {
        payment = await payWithRazorpay({
          ...session,
          description: works.map((w) => w.title).join(', '),
          customer: { name: form.name.trim(), email: form.email.trim(), phone: cleanPhone(form.phone) },
        });
      } catch (err) {
        if (!err.dismissed) throw userError(err.message);
        if (alive.current && err.failure) setPayError(`${err.failure} Nothing was charged. You can try again.`);
        return;
      }

      /* 3 · confirm it on the server */
      setPhase('confirming');
      const result = await confirmPayment(session.orderId, payment);

      /* The artist's alert, if the server couldn't email it. Sent in the background: the buyer has
         paid, so a slow or failing email service must never hold up their confirmation. The browser
         can't prove a payment, so an unconfirmed one says to check Razorpay first. */
      if (!result.notified) {
        sendForm({
          subject: `${result.confirmed ? 'Paid order' : 'Order (check payment in Razorpay)'} ${session.orderId} from ${form.name.trim()}: ${works.map((w) => w.title).join(', ')}`,
          name: form.name.trim(),
          email: form.email.trim(),
          botcheck,
          fields: {
            'Order': session.orderId,
            'Paid': `${formatINR(total)} · Razorpay payment ${payment.razorpay_payment_id}${result.confirmed ? '' : ' (not yet verified by the server)'}`,
            'Works': works.map((w) => `${w.title} (${w.price})`).join('\n'),
            'Phone': cleanPhone(form.phone),
            'Ship to': [form.address, form.city, form.state, form.pin, 'India'].map((s) => s.trim()).filter(Boolean).join(', '),
            'Shiprocket': !result.confirmed ? 'Not confirmed yet: check the Razorpay dashboard, then Shiprocket.' : result.shiprocket?.ok ? 'Created automatically. Assign a courier and ship.' : `NOT created: ${result.shiprocket?.error || 'unknown'}. Add this order in Shiprocket by hand.`,
            'Check': result.problem || '',
            'Note': form.note.trim(),
          },
          keepalive: true,
        }).catch((err) => console.error('Order alert failed:', err));
      }

      for (const w of works) w.status = 'sold';
      checkout.current = null;
      removeMany(ids);
      if (!alive.current) return;
      setPaid({ orderId: session.orderId, email: form.email.trim(), works: ids, confirmed: result.confirmed, lost: result.lost.map((w) => w.title) });
      setStep(4);
    } catch (err) {
      console.error('Checkout failed:', err);
      if (!alive.current) return;
      /* something was sold or held meanwhile: take it out, so the buyer can carry on with the rest */
      if (err.taken?.length) {
        checkout.current = null;
        removeMany(err.taken);
        const left = ids.filter((id) => !err.taken.includes(id));
        if (!left.length) {
          setNotice(`${err.message} It has been taken out of your order.`);
          setStep(1);
          return;
        }
        setPayError(`${err.message} I’ve taken ${err.taken.length > 1 ? 'them' : 'it'} out of your order: check the new total and pay again.`);
        return;
      }
      /* the server didn't accept a detail: show it on the field */
      if (err.fields?.length) {
        setErrors(Object.fromEntries(err.fields.map((f) => [f, FIELD_MESSAGES[f] || 'Please check this.'])));
        setStep(2);
        return;
      }
      setPayError(err.userFacing ? err.message : PAY_ERROR);
    } finally {
      if (alive.current) setPhase(null);
    }
  };

  const restart = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setAck(false);
    setAckError(false);
    setPayError(null);
    setNotice(null);
    setPickError(false);
    setPaid(null);
    setStep(1);
  };
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onToggle = (id) => {
    setPickError(false);
    setNotice(null);
    toggle(id);
  };

  const progress = step >= 4 ? 1 : (step - 1) / 3 + 0.12;

  return (
    <>
      {/* ============================== INTRO + STEPS */}
      <PageTop labelledBy="or-h" crumbs={[{ label: 'Shop', to: '/shop' }, { label: 'Order' }]} paddingBottom="pb-[clamp(32px,4vw,56px)]" bodyClassName="mt-8 grid-12">
        <div className="col-[1/8] max-lg:col-span-full">
          <p data-intro className="eyebrow">
            Order an original
          </p>
          <h1 id="or-h" data-intro-line className="heading-1 mt-5">
            <Line>Choose a work.</Line>
            <Line className="pl-[12%]">
              Make it <Accent>yours.</Accent>
            </Line>
          </h1>
        </div>
        <div data-intro className="col-[9/13] self-end max-lg:col-span-full max-lg:mt-7">
          <p className="lead">
            Pick the originals you’d like, tell me where they’re going, and pay securely with UPI, card or netbanking. I pack and send every painting myself.
          </p>
          <p className="meta mt-3.5 font-semibold text-success!">Free shipping within India.</p>
        </div>
        <div data-intro className="relative col-span-full mt-14 mb-4">
          <span
            aria-hidden="true"
            className="absolute top-0 left-0 h-0.5 w-full origin-left bg-secondary transition-transform duration-900 ease-gallery"
            style={{ transform: `scaleX(${progress})` }}
          />
          <ol aria-label="Order steps" className="m-0 grid list-none grid-cols-3 gap-4 p-0">
            {STEPS.map((label, i) => {
              const n = i + 1;
              const tone = step >= n ? 'text-primary' : 'text-muted';
              return (
                <li key={label} aria-current={step === n ? 'step' : undefined} className="relative flex flex-col gap-1.5 pt-[18px] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-divider">
                  <span className={`font-display text-[28px] leading-none italic ${tone}`}>0{n}</span>
                  <span className={`text-[13px] font-semibold max-sm:hidden ${tone}`}>{label}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </PageTop>

      {/* ============================== THE ORDER */}
      <section id="choose" aria-label="Your order" className="pb-[clamp(96px,11vw,160px)]">
        <div className="wrap">
          <div className="grid grid-cols-12 items-start gap-x-8">
            <div ref={panelRef} className="col-[1/9] max-lg:col-span-full">
              {step === 1 && (
                <ChooseStep
                  selection={bag}
                  onToggle={onToggle}
                  onContinue={toDetails}
                  pickError={pickError}
                  notices={[
                    notice,
                    soldOff.length > 0 && `${soldOff.join(', ')} ${soldOff.length > 1 ? 'have' : 'has'} sold since you added ${soldOff.length > 1 ? 'them' : 'it'}, so ${soldOff.length > 1 ? 'they’re' : 'it’s'} no longer in your order.`,
                    pickedOff && `${pickedOff} can’t be ordered online. Write to me about it, or choose another original.`,
                  ].filter(Boolean)}
                />
              )}
              {step === 2 && <DetailsStep form={form} errors={errors} onChange={onChange} onBack={() => setStep(1)} onSubmit={toReview} />}
              {step === 3 && (
                <ReviewStep
                  form={form}
                  total={formatINR(bag.map(getWork).reduce((s, w) => s + priceValue(w), 0))}
                  ack={ack}
                  ackError={ackError}
                  phase={phase}
                  error={payError}
                  onAck={(checked) => {
                    setAck(checked);
                    setAckError(false);
                  }}
                  onEdit={() => !phase && setStep(2)}
                  onSubmit={pay}
                />
              )}
              {step === 4 && paid && <OrderDone firstName={form.name.trim().split(' ')[0]} {...paid} onRestart={restart} />}
            </div>
            <OrderSummary selection={step === 4 && paid ? paid.works : bag} canEdit={step <= 2} onRemove={remove} paid={step === 4} />
          </div>
        </div>
      </section>
    </>
  );
}
