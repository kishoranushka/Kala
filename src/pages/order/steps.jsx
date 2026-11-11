import { Link } from 'react-router-dom';
import cx from '@/utils/cx';
import { WORKS, getWork, isBuyable, metaLine, onSale, plateLabel, ratioOf } from '@/data/works';
import SalePrice from '@/components/art/Price';
import ShopCard from '@/components/art/ShopCard';
import { Checkbox, ErrorSummary, Field, FieldError, FieldRow, Input, Textarea, describe } from '@/components/form/Fields';
import FormSuccess from '@/components/form/FormSuccess';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import TextLink from '@/components/ui/TextLink';
import Notice from '@/components/ui/Notice';
import { REVIEW_LIST, Totals } from './OrderSummary';

const STEP_HEADING = 'mt-2 font-display text-[clamp(30px,3vw,44px)] leading-[1.06] font-light tracking-[-.01em]';
/* Back · Next. On phones: the next button full width on top, the back link centred beneath it */
const NAV_ROW =
  'flex flex-wrap items-center justify-between gap-4 border-t border-divider pt-7 max-sm:flex-col-reverse max-sm:items-stretch max-sm:gap-1 max-sm:pt-6 max-sm:[&>:first-child]:self-center';
const imgClass = (w, extra) => cx('block size-full object-cover', extra, w.crop && 'crop-ig');

function StepHeading({ step, id, title, children }) {
  return (
    <div>
      <p className="eyebrow">Step 0{step}</p>
      <h2 id={id} className={STEP_HEADING}>
        {title}
      </h2>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ 1 · cart */
/* only what's in the cart; other paintings are suggested below the page (see Recommendations) */
export function CartStep({ selection, onRemove, onContinue, pickError, notices = [] }) {
  const items = selection.map(getWork).filter(Boolean);
  return (
    <div className="flex flex-col gap-6">
      <StepHeading step={1} title="Your cart">
        <p className="meta mt-2">
          {items.length ? `${items.length} ${items.length === 1 ? 'original' : 'originals'}, each the only one there is.` : 'Nothing in your cart yet.'}
        </p>
      </StepHeading>
      {notices.map((text) => (
        <Notice key={text} tone="warn" role="status">
          {text}
        </Notice>
      ))}

      {items.length === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded-ui bg-surface p-7 max-sm:p-5">
          <p className="m-0 font-display text-[28px]/9 font-light">
            Your cart is <span className="italic">empty.</span>
          </p>
          <p className="meta m-0">Add an original from the shop, or pick one of the suggestions below.</p>
          <Button variant="secondary" to="/shop" arrow>
            Explore the Shop
          </Button>
        </div>
      ) : (
        <ul aria-label="In your cart" className="m-0 list-none border-t border-divider p-0">
          {items.map((w) => (
            <li key={w.id} className="flex gap-5 border-b border-divider py-5 max-sm:gap-3.5">
              <Link
                to={`/artwork/${w.id}`}
                aria-label={`View ${w.title}`}
                className="relative block w-[112px] shrink-0 self-start overflow-hidden rounded-ui bg-wall max-sm:w-[84px]"
                style={{ aspectRatio: ratioOf(w) }}
              >
                <img src={w.img} alt="" loading="lazy" className={imgClass(w)} />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="eyebrow truncate">{plateLabel(w)}</span>
                <Link to={`/artwork/${w.id}`} className="font-display text-2xl/7 font-medium text-primary no-underline hover:text-primary max-sm:text-xl/6">
                  {w.title}
                </Link>
                <span className="meta">{metaLine(w)}</span>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-3">
                  <SalePrice work={w} />
                  <button
                    type="button"
                    onClick={() => onRemove(w.id)}
                    aria-label={`Remove ${w.title} from your cart`}
                    className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 font-sans text-[13px] font-semibold text-link"
                  >
                    <Icon name="close" size={16} strokeWidth={1.8} />
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* phones: the total sits right under the cart (the summary card is hidden there on this step) */}
      {items.length > 0 && (
        <div className="hidden rounded-ui bg-surface p-5 max-lg:block">
          <Totals selection={selection} />
        </div>
      )}

      <div className={NAV_ROW}>
        <TextLink to="/shop">Back to the shop</TextLink>
        <Button data-magnetic arrow onClick={onContinue} aria-disabled={selection.length === 0} className="max-sm:w-full">
          Continue to Your Details
        </Button>
      </div>
      {pickError && (
        <FieldError className="m-0" role="alert">
          Add at least one original to continue.
        </FieldError>
      )}
    </div>
  );
}

/* "You may also like": other paintings that can be bought online, at the very bottom of the cart page */
export function Recommendations({ selection }) {
  /* worked out on each visit: a painting bought a moment ago is already Sold */
  const picks = WORKS.filter((w) => isBuyable(w) && !selection.includes(w.id))
    .reverse()
    .sort((a, b) => onSale(b) - onSale(a))
    .slice(0, 4);
  if (!picks.length) return null;
  return (
    <section aria-labelledby="recs-h" className="border-t border-divider pt-[clamp(56px,7vw,96px)] pb-[clamp(96px,11vw,160px)]">
      <div className="wrap">
        <div className="mb-[clamp(28px,4vw,48px)] flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{selection.length ? 'Goes well with your cart' : 'Start with one of these'}</p>
            <h2 id="recs-h" className="mt-3 mb-0 font-display text-[clamp(30px,3vw,44px)] leading-[1.06] font-light">
              You may also <em>like</em>
            </h2>
          </div>
          <TextLink to="/shop?available" arrow>
            See every available painting
          </TextLink>
        </div>
        <div className="grid grid-cols-[repeat(4,minmax(0,1fr))] gap-7 max-xl:grid-cols-[repeat(2,minmax(0,1fr))] max-sm:gap-x-4">
          {picks.map((w) => (
            <ShopCard key={w.id} work={w} titleClassName="text-[22px]/[26px] max-sm:text-[17px]/[22px]" />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 2 · details */
export function DetailsStep({ form, errors, onChange, onBack, onSubmit }) {
  const field = (name, id) => ({ name, value: form[name], onChange, ...describe(id, { error: errors[name] }) });

  return (
    <form noValidate onSubmit={onSubmit} aria-labelledby="det-h" className="flex flex-col gap-6">
      <StepHeading step={2} id="det-h" title="Your details">
        <p className="meta mt-2">Fields marked * are needed to confirm your order.</p>
      </StepHeading>
      <ErrorSummary count={Object.keys(errors).length} suffix="." />

      <FieldRow>
        <Field id="o-name" label="Full name *" error={errors.name}>
          <Input type="text" autoComplete="name" {...field('name', 'o-name')} />
        </Field>
        <Field id="o-email" label="Email *" error={errors.email}>
          <Input type="email" autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false} {...field('email', 'o-email')} />
        </Field>
      </FieldRow>
      <Field id="o-phone" label="Mobile number *" hint="The courier calls this number on delivery." error={errors.phone} className="max-w-[360px] max-sm:max-w-none">
        <Input type="tel" inputMode="tel" autoComplete="tel" name="phone" value={form.phone} onChange={onChange} {...describe('o-phone', { hint: true, error: errors.phone })} />
      </Field>

      <fieldset className="m-0 flex flex-col gap-6 border-0 p-0">
        <legend className="mb-1 p-0 text-[13px]/5 font-semibold">Where should it go? *</legend>
        <p className="meta -mt-1">
          Packed with care and shipped free within India. Ordering from abroad?{' '}
          <Link to="/contact" className="font-semibold text-link">
            Write to me
          </Link>{' '}
          and I’ll arrange it.
        </p>
        <Field id="o-addr" label="Address *" error={errors.address}>
          <Input type="text" autoComplete="street-address" {...field('address', 'o-addr')} />
        </Field>
        <FieldRow cols="three">
          <Field id="o-city" label="City *" error={errors.city}>
            <Input type="text" autoComplete="address-level2" {...field('city', 'o-city')} />
          </Field>
          <Field id="o-state" label="State *" error={errors.state}>
            <Input type="text" autoComplete="address-level1" {...field('state', 'o-state')} />
          </Field>
          <Field id="o-pin" label="PIN code *" error={errors.pin}>
            <Input type="text" inputMode="numeric" autoComplete="postal-code" maxLength={6} {...field('pin', 'o-pin')} />
          </Field>
        </FieldRow>
      </fieldset>

      <Field id="o-note" label="A note for the artist" hint="A gift message, framing questions, a deadline. Optional.">
        <Textarea name="note" value={form.note} onChange={onChange} className="min-h-[110px]!" {...describe('o-note', { hint: true })} />
      </Field>

      <div className={NAV_ROW}>
        <TextLink onClick={onBack}>Back to your works</TextLink>
        <Button type="submit" data-magnetic arrow className="max-sm:px-4">
          Review Your Order
        </Button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ 3 · review */
const PAY_LABEL = { starting: 'Opening payment…', paying: 'Waiting for payment…', confirming: 'Confirming payment…' };

export function ReviewStep({ form, total, ack, ackError, phase, error, onAck, onEdit, onSubmit }) {
  const shipTo = [form.address, form.city, form.state, form.pin, 'India'].map((s) => s.trim()).filter(Boolean).join(', ');
  const busy = Boolean(phase);

  return (
    <form noValidate onSubmit={onSubmit} aria-labelledby="rev-h" className="flex flex-col gap-6">
      <StepHeading step={3} id="rev-h" title="Review and pay" />
      <div className="bg-surface p-6 max-sm:p-5">
        <div className="flex items-baseline justify-between gap-4">
          <p className="eyebrow">Your details</p>
          <button type="button" onClick={onEdit} disabled={busy} className="-my-2 min-h-11 cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] font-semibold text-link disabled:cursor-not-allowed disabled:opacity-50">
            Edit
          </button>
        </div>
        <dl className={cx(REVIEW_LIST, 'mt-3')}>
          <dt>Name</dt>
          <dd>{form.name}</dd>
          <dt>Email</dt>
          <dd>{form.email}</dd>
          <dt>Phone</dt>
          <dd>{form.phone}</dd>
          <dt>Ship to</dt>
          <dd>{shipTo}</dd>
          <dt>Note</dt>
          <dd>{form.note || 'None'}</dd>
        </dl>
      </div>
      <div className="bg-surface p-6 max-sm:p-5">
        <p className="eyebrow">What happens next</p>
        <ol className="mt-3 list-decimal pl-5 text-sm/6 text-soft">
          <li>Pay securely through Razorpay: scan the UPI QR code, or use a UPI app, card or netbanking.</li>
          <li>Your order is confirmed straight away, with an order reference.</li>
          <li>I pack your painting with care and ship it. The courier’s tracking reaches you by SMS and email.</li>
        </ol>
      </div>
      <Checkbox name="ack" checked={ack} disabled={busy} onChange={(e) => onAck(e.target.checked)} aria-invalid={ackError || undefined} aria-describedby={ackError ? 'oe-ack' : undefined}>
        My details are correct, I understand each painting is a one-of-a-kind original, and I agree to the{' '}
        <a href="/terms" target="_blank" rel="noopener" className="font-semibold text-link">
          Terms
        </a>{' '}
        and{' '}
        <a href="/returns" target="_blank" rel="noopener" className="font-semibold text-link">
          Returns policy
        </a>
        : once my order is confirmed it can’t be cancelled, returned or refunded.
      </Checkbox>
      {ackError && (
        <FieldError id="oe-ack" role="alert">
          Tick the box above to continue to payment.
        </FieldError>
      )}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      {error && (
        <Notice tone="error" role="alert">
          {error}
        </Notice>
      )}
      <div className={NAV_ROW}>
        <TextLink onClick={onEdit} disabled={busy} className="disabled:cursor-not-allowed disabled:opacity-50">
          Back to your details
        </TextLink>
        <Button type="submit" data-magnetic aria-busy={busy} aria-disabled={busy || undefined}>
          {PAY_LABEL[phase] ?? `Pay ${total}`}
        </Button>
      </div>
      {phase === 'paying' && (
        <p className="meta" role="status">
          Finish paying in the Razorpay window. If you close it without paying, nothing is charged and you can try again.
        </p>
      )}
      {phase === 'confirming' && (
        <p className="meta" role="status">
          Payment received. Please keep this page open for a moment while I confirm your order.
        </p>
      )}
    </form>
  );
}

/* ------------------------------------------------------------------ done */
export function OrderDone({ firstName, orderId, email, confirmed, lost = [], works = [], onRestart }) {
  /* the email travels in router state, not the URL (history, shared links) */
  const track = `/track?id=${encodeURIComponent(orderId)}`;
  const allLost = lost.length > 0 && lost.length >= works.length;
  return (
    <FormSuccess eyebrow="Payment received" name={firstName || 'there'} titleClassName="heading-2" className="gap-6">
      {lost.length > 0 && (
        <Notice tone="warn" role="alert">
          I’m sorry: {lost.join(', ')} went to another buyer moments before your payment came through. You’ll get a full refund for{' '}
          {allLost ? 'your payment' : 'that part'}, and I’ll write to you at {email} shortly.
        </Notice>
      )}
      <p className="lead">
        {allLost
          ? 'Nothing else is needed from you; the refund goes back the way you paid.'
          : confirmed
            ? 'Your order is confirmed. I’ll pack your painting with care and send it soon. Once it ships, the courier’s tracking reaches you by SMS and email.'
            : 'Your payment went through and your order is being confirmed. That can take a few minutes; you don’t need to pay again.'}
      </p>
      <p className="meta">
        Your order reference is <b className="font-semibold text-primary">{orderId}</b>. With it and your email you can track your order any time. Razorpay also emails you a payment receipt.
      </p>
      <div className="flex flex-wrap gap-4 max-sm:flex-col max-sm:gap-3">
        <Button to={track} state={{ email }}>
          Track Your Order
        </Button>
        <Button variant="secondary" to="/shop">
          Back to the Shop
        </Button>
      </div>
      <TextLink onClick={onRestart}>Start a new order</TextLink>
    </FormSuccess>
  );
}
