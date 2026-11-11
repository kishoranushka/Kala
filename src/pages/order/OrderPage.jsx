import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CONTACT, EMAIL_PATTERN } from '@/data/site';
import { WORKS, formatINR, getWork, isBuyable, priceValue } from '@/data/works';
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

const PHONE_PATTERN = /^[6-9]\d{9}$/;
/* "+91 98765-43210" → "9876543210" */
const cleanPhone = (p) => p.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');

function validate(f) {
  const errors = {};
  if (!f.name.trim()) errors.name = 'Add your full name.';
  if (!f.email.trim()) errors.email = 'Add your email for your order confirmation.';
  else if (!EMAIL_PATTERN.test(f.email.trim())) errors.email = 'Add the rest of your email, like name@example.com.';
  if (!PHONE_PATTERN.test(cleanPhone(f.phone))) errors.phone = 'Add a 10-digit mobile number for the courier.';
  if (!f.address.trim()) errors.address = 'Add the street address.';
  if (!f.city.trim()) errors.city = 'Add the city.';
  if (!f.state.trim()) errors.state = 'Add the state.';
  if (!/^\d{6}$/.test(f.pin.trim())) errors.pin = 'Add a 6-digit PIN code.';
  return errors;
}

const userError = (message) => Object.assign(new Error(message), { userFacing: true });

/* 1 · /api/order prices the works, holds them while you pay, and opens a Razorpay order */
async function startCheckout(bag, form, replaces) {
  const res = await fetch('/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ works: bag, customer: { ...form, phone: cleanPhone(form.phone) }, replaces }),
  }).catch(() => null);
  if (!res) throw userError('Couldn’t reach the shop. Check your connection and try again.');
  const out = await res.json().catch(() => ({}));
  if ([409, 422, 503].includes(res.status) && out.error) throw userError(out.error);
  if (!res.ok || !out.razorpayOrderId) throw new Error(`checkout ${res.status}`);
  return out;
}

/* 3 · /api/verify checks the payment signature and confirms the order. If it can't be reached,
   Razorpay's webhook confirms it on the server anyway, so this never throws. */
async function confirmPayment(orderId, paid) {
  try {
    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, ...paid }),
    });
    const out = await res.json().catch(() => ({}));
    return { confirmed: res.ok && out.status === 'paid', notified: Boolean(out.notified), shiprocket: out.shiprocket, problem: out.problem };
  } catch {
    return { confirmed: false, notified: false };
  }
}

/* Choose → details → review & pay → paid. The selection is the bag, limited to works that can be bought online. */
export default function OrderPage() {
  const { bag, setBag, toggle, remove } = useBag();
  const [params] = useSearchParams();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [pickError, setPickError] = useState(false);
  const [ack, setAck] = useState(false);
  const [ackError, setAckError] = useState(false);
  const [phase, setPhase] = useState(null); // null · 'starting' · 'paying' · 'confirming'
  const [payError, setPayError] = useState(null);
  const [paid, setPaid] = useState(null); // { orderId, email, works, confirmed }
  const checkout = useRef(null); // the open Razorpay order, reused if the buyer closes the window and tries again
  const panelRef = useRef(null);
  const alive = useRef(true);
  const motion = useMotionApi();

  /* arrive with only what can still be bought, plus the work picked on its page */
  useEffect(() => {
    const buyable = new Set(WORKS.filter(isBuyable).map((w) => w.id));
    const picked = params.get('work');
    setBag((b) => {
      const next = b.filter((id) => buyable.has(id));
      if (picked && buyable.has(picked) && !next.includes(picked)) next.push(picked);
      return next;
    });
  }, [params, setBag]);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

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
    const found = validate(form);
    setErrors(found);
    if (!Object.keys(found).length) setStep(3);
  };

  const pay = async (e) => {
    e.preventDefault();
    if (phase) return;
    if (!ack) return setAckError(true);
    setPayError(null);
    const botcheck = e.currentTarget.elements.botcheck?.checked;
    const works = bag.map(getWork).filter(Boolean);
    const total = works.reduce((s, w) => s + priceValue(w), 0);
    const sig = JSON.stringify([bag, form]);

    try {
      /* 1 · start (or reopen) the checkout */
      setPhase('starting');
      let session = checkout.current?.sig === sig ? checkout.current : null;
      if (!session) {
        session = { sig, ...(await startCheckout(bag, form, checkout.current?.orderId)) };
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

      /* the artist's alert, if the server couldn't email it */
      if (!result.notified) {
        await sendForm({
          subject: `Paid order ${session.orderId} from ${form.name.trim()}: ${works.map((w) => w.title).join(', ')}`,
          name: form.name.trim(),
          email: form.email.trim(),
          botcheck,
          fields: {
            'Order': session.orderId,
            'Paid': `${formatINR(total)} · Razorpay payment ${payment.razorpay_payment_id}`,
            'Works': works.map((w) => `${w.title} (${w.price})`).join('\n'),
            'Phone': cleanPhone(form.phone),
            'Ship to': [form.address, form.city, form.state, form.pin, 'India'].map((s) => s.trim()).filter(Boolean).join(', '),
            'Shiprocket': !result.confirmed ? 'Not confirmed yet: check the Razorpay dashboard, then Shiprocket.' : result.shiprocket?.ok ? 'Created automatically. Assign a courier and ship.' : `NOT created: ${result.shiprocket?.error || 'unknown'}. Add this order in Shiprocket by hand.`,
            'Check': result.problem || '',
            'Note': form.note.trim(),
          },
        }).catch((err) => console.error('Order alert failed:', err));
      }

      for (const w of works) w.status = 'sold';
      checkout.current = null;
      if (!alive.current) return;
      setPaid({ orderId: session.orderId, email: form.email.trim(), works: [...bag], confirmed: result.confirmed });
      setBag([]);
      setStep(4);
    } catch (err) {
      console.error('Checkout failed:', err);
      if (alive.current) setPayError(err.userFacing ? err.message : PAY_ERROR);
    } finally {
      if (alive.current) setPhase(null);
    }
  };

  const restart = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setAck(false);
    setPaid(null);
    setStep(1);
  };
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onToggle = (id) => {
    setPickError(false);
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
              {step === 1 && <ChooseStep selection={bag} onToggle={onToggle} onContinue={toDetails} pickError={pickError} />}
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
                  onEdit={() => setStep(2)}
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
