import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EMAIL_PATTERN } from '@/data/site';
import { availableWorks } from '@/data/works';
import { useBag } from '@/context/BagContext';
import { gsap, canAnimate } from '@/motion/gsap';
import { useMotionApi } from '@/motion/MotionContext';
import PageIntro from '@/components/sections/PageIntro';
import { Accent, Line } from '@/components/ui/Typography';
import OrderSummary from './OrderSummary';
import { ChooseStep, DetailsStep, OrderDone, ReviewStep } from './steps';

const STEPS = ['Choose', 'Your details', 'Review'];
const EMPTY_FORM = { name: '', email: '', phone: '', delivery: 'ship', address: '', city: '', state: '', pin: '', country: 'India', note: '' };

function validate(f) {
  const errors = {};
  if (!f.name.trim()) errors.name = 'Add your full name.';
  if (!f.email.trim()) errors.email = 'Add your email so I can confirm your order.';
  else if (!EMAIL_PATTERN.test(f.email.trim())) errors.email = 'Add the rest of your email, like name@example.com.';
  if (f.delivery !== 'collect') {
    if (!f.address.trim()) errors.address = 'Add the street address.';
    if (!f.city.trim()) errors.city = 'Add the city.';
    if (!/^\d{6}$/.test(f.pin.trim())) errors.pin = 'Add a 6-digit PIN code.';
  }
  return errors;
}

/* Choose → details → review → request sent. The selection is the bag, limited to available originals. */
export default function OrderPage() {
  const { bag, setBag, toggle, remove } = useBag();
  const [params] = useSearchParams();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [pickError, setPickError] = useState(false);
  const [ack, setAck] = useState(false);
  const [ackError, setAckError] = useState(false);
  const [sending, setSending] = useState(false);
  const panelRef = useRef(null);
  const sendTimer = useRef(null);
  const motion = useMotionApi();

  /* arrive with only what can still be ordered, plus the work picked on its page */
  useEffect(() => {
    const orderable = new Set(availableWorks().map((w) => w.id));
    const picked = params.get('work');
    setBag((b) => {
      const next = b.filter((id) => orderable.has(id));
      if (picked && orderable.has(picked) && !next.includes(picked)) next.push(picked);
      return next;
    });
    return () => clearTimeout(sendTimer.current);
  }, [params, setBag]);

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
  const send = (e) => {
    e.preventDefault();
    if (sending) return;
    if (!ack) return setAckError(true);
    setSending(true);
    sendTimer.current = setTimeout(() => {
      setSending(false);
      setStep(4);
    }, 900);
  };
  const restart = () => {
    setBag([]);
    setForm(EMPTY_FORM);
    setErrors({});
    setAck(false);
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
      <PageIntro labelledBy="or-h" crumbs={[{ label: 'Shop', to: '/shop' }, { label: 'Order' }]} paddingBottom="pb-[clamp(32px,4vw,56px)]">
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
            Pick the originals you’d like, tell me where they’re going, and send an order request. I confirm availability and shipping, then send a secure payment link.
          </p>
          <p className="meta mt-3.5 font-semibold text-success!">Nothing is charged on this site.</p>
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
      </PageIntro>

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
                  ack={ack}
                  ackError={ackError}
                  sending={sending}
                  onAck={(checked) => {
                    setAck(checked);
                    setAckError(false);
                  }}
                  onEdit={() => setStep(2)}
                  onSubmit={send}
                />
              )}
              {step === 4 && <OrderDone firstName={form.name.trim().split(' ')[0]} onRestart={restart} />}
            </div>
            <OrderSummary selection={bag} canEdit={step <= 2} onRemove={remove} collect={form.delivery === 'collect'} />
          </div>
        </div>
      </section>
    </>
  );
}
