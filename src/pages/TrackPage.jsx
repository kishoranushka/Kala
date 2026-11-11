import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import cx from '@/utils/cx';
import { CONTACT, EMAIL_PATTERN } from '@/data/site';
import { formatINR, getWork } from '@/data/works';
import PageTop from '@/components/sections/PageTop';
import { Accent, Line } from '@/components/ui/Typography';
import { Field, FieldRow, Input, describe } from '@/components/form/Fields';
import Button from '@/components/ui/Button';
import Notice from '@/components/ui/Notice';
import TextLink from '@/components/ui/TextLink';
import { REVIEW_LIST } from './order/OrderSummary';

const STAGES = ['Paid', 'Packed', 'On its way', 'Delivered'];

/* how far along the order is: 0 = not paid, 1 paid … 4 delivered */
function stageOf(order) {
  if (order.status !== 'paid') return 0;
  const s = order.shipment;
  if (!s) return 1;
  if (s.delivered) return 4;
  if (/pick(ed)?\s*up|transit|out for delivery|shipped|reached|dispatched/i.test(s.status || '')) return 3;
  return 2;
}

const when = (iso) => (iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '');

function Result({ order }) {
  const stage = stageOf(order);
  const s = order.shipment;
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="eyebrow">Order {order.id}</p>
        <h2 className="mt-2 font-display text-[clamp(30px,3vw,44px)] leading-[1.06] font-light tracking-[-.01em]">
          {stage === 0 ? 'Not paid' : STAGES[stage - 1]}
        </h2>
        <p className="meta mt-2">
          {stage === 0 && `This checkout wasn’t completed, so nothing was charged. If money did leave your account, write to me at ${CONTACT.email} with this reference.`}
          {stage === 1 && `Paid on ${when(order.paidAt)}. I’m packing your painting; courier details appear here once it’s booked.`}
          {stage >= 2 && s && [s.status, s.updated && `updated ${s.updated}`].filter(Boolean).join(' · ')}
        </p>
      </div>

      {stage > 0 && (
        <ol aria-label="Order progress" className="m-0 grid list-none grid-cols-4 gap-3 p-0">
          {STAGES.map((label, i) => (
            <li key={label} aria-current={stage === i + 1 ? 'step' : undefined} className="flex flex-col gap-2">
              <span className={cx('h-0.5 w-full', stage > i ? 'bg-secondary' : 'bg-divider')} />
              <span className={cx('text-[13px] font-semibold', stage > i ? 'text-primary' : 'text-muted')}>{label}</span>
            </li>
          ))}
        </ol>
      )}

      <div className="bg-page p-6">
        <dl className={REVIEW_LIST}>
          <dt>Paintings</dt>
          <dd>{order.works.map((w) => getWork(w.id)?.title ?? w.title).join(', ')}</dd>
          <dt>Total</dt>
          <dd>{formatINR(order.amount)}</dd>
          <dt>Ordered</dt>
          <dd>{when(order.createdAt)}</dd>
          {order.city && (
            <>
              <dt>Going to</dt>
              <dd>{order.city}</dd>
            </>
          )}
          {s?.courier && (
            <>
              <dt>Courier</dt>
              <dd>{s.courier}</dd>
            </>
          )}
          {s?.awb && (
            <>
              <dt>Tracking no.</dt>
              <dd>{s.awb}</dd>
            </>
          )}
          {s?.eta && !s.delivered && (
            <>
              <dt>Expected</dt>
              <dd>{s.eta}</dd>
            </>
          )}
        </dl>
      </div>
      {s?.url && (
        <div>
          <Button to={s.url} arrow>
            Live Courier Tracking
          </Button>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  const [params] = useSearchParams();
  const [values, setValues] = useState({ id: params.get('id') || '', email: params.get('email') || '' });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({ loading: false, order: null, error: null });
  const auto = useRef(Boolean(values.id && values.email));

  const lookup = async ({ id, email }) => {
    setState({ loading: true, order: null, error: null });
    try {
      const res = await fetch(`/api/track?id=${encodeURIComponent(id.trim())}&email=${encodeURIComponent(email.trim())}`);
      const out = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(out.error || 'Tracking is unavailable right now. Please try again shortly.');
      setState({ loading: false, order: out, error: null });
    } catch (err) {
      setState({ loading: false, order: null, error: err.message === 'Failed to fetch' ? 'Couldn’t reach the shop. Check your connection.' : err.message });
    }
  };

  /* arriving from the confirmation link: look it up straight away */
  useEffect(() => {
    if (auto.current) {
      auto.current = false;
      lookup(values);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = (e) => {
    e.preventDefault();
    const found = {};
    if (!/^\s*kala-[a-z0-9]{4,20}\s*$/i.test(values.id)) found.id = 'Add your order reference, like KALA-MH8K2Q1A.';
    if (!EMAIL_PATTERN.test(values.email.trim())) found.email = 'Add the email you ordered with.';
    setErrors(found);
    if (!Object.keys(found).length) lookup(values);
  };
  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  return (
    <>
      <PageTop labelledBy="tr-h" crumbs={[{ label: 'Shop', to: '/shop' }, { label: 'Track your order' }]} bodyClassName="mt-8 grid-12">
        <div className="col-[1/8] max-lg:col-span-full">
          <p data-intro className="eyebrow">
            Track your order
          </p>
          <h1 id="tr-h" data-intro-line className="heading-1 mt-5">
            <Line>Where is my</Line>
            <Line className="pl-[12%]">
              <Accent>painting?</Accent>
            </Line>
          </h1>
        </div>
        <div data-intro className="col-[9/13] self-end max-lg:col-span-full max-lg:mt-7">
          <p className="lead">Enter the order reference from your confirmation and the email you ordered with. No account needed.</p>
        </div>
      </PageTop>

      <section aria-label="Order lookup" className="pb-[clamp(96px,11vw,160px)]">
        <div className="wrap">
          <div className="grid-12 items-start">
            <div data-cap className="col-[1/8] flex flex-col gap-10 bg-surface p-[clamp(28px,4vw,56px)] max-lg:col-span-full max-sm:-mx-5">
              <form noValidate onSubmit={submit} className="flex flex-col gap-6">
                <FieldRow>
                  <Field id="t-id" label="Order reference *" error={errors.id}>
                    <Input name="id" type="text" autoComplete="off" autoCapitalize="characters" placeholder="KALA-…" value={values.id} onChange={onChange} {...describe('t-id', { error: errors.id })} />
                  </Field>
                  <Field id="t-email" label="Email *" error={errors.email}>
                    <Input name="email" type="email" autoComplete="email" inputMode="email" value={values.email} onChange={onChange} {...describe('t-email', { error: errors.email })} />
                  </Field>
                </FieldRow>
                <div>
                  <Button type="submit" data-magnetic aria-busy={state.loading}>
                    {state.loading ? 'Looking…' : 'Track Order'}
                  </Button>
                </div>
              </form>
              <div aria-live="polite">
                {state.error && (
                  <Notice tone="error" role="alert">
                    {state.error}
                  </Notice>
                )}
                {state.order && <Result order={state.order} />}
              </div>
            </div>
            <aside className="col-[9/13] flex flex-col gap-4 max-lg:col-span-full max-lg:mt-10">
              <p className="eyebrow">Good to know</p>
              <p className="meta">Your order reference starts with KALA- and is in your confirmation, on the thank-you screen and in the Razorpay receipt.</p>
              <p className="meta">Once your painting ships, the courier also sends tracking updates by SMS and email.</p>
              <p className="meta">
                Something not right? <TextLink to="/contact">Write to me</TextLink> with your reference.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
