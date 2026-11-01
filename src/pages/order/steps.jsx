import { Link } from 'react-router-dom';
import cx from '@/utils/cx';
import { CONTACT } from '@/data/site';
import { STATUS, WORKS, plateLabel, ratioOf } from '@/data/works';
import { Checkbox, ChoiceCard, ChoiceGrid, ErrorSummary, Field, FieldError, FieldRow, Input, Textarea, describe } from '@/components/form/Fields';
import FormSuccess from '@/components/form/FormSuccess';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import StatusBadge from '@/components/ui/StatusBadge';
import TextLink from '@/components/ui/TextLink';
import { REVIEW_LIST } from './OrderSummary';

const STEP_HEADING = 'mt-2 font-display text-[clamp(30px,3vw,44px)] leading-[1.06] font-light tracking-[-.01em]';
const NAV_ROW = 'flex flex-wrap items-center justify-between gap-4 border-t border-divider pt-7';
const available = WORKS.filter((w) => w.status === 'available');
const unavailable = WORKS.filter((w) => w.status !== 'available');
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

/* ------------------------------------------------------------------ 1 · choose */
export function ChooseStep({ selection, onToggle, onContinue, pickError }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <StepHeading step={1} title="Choose your originals" />
        <p className="meta">Tap a work to add it. Tap again to remove it.</p>
      </div>

      <div data-stagger className="grid grid-cols-3 items-start gap-x-6 gap-y-7 max-lg:grid-cols-2 max-sm:gap-x-3.5 max-sm:gap-y-5">
        {available.map((w) => {
          const on = selection.includes(w.id);
          return (
            <button
              key={w.id}
              type="button"
              data-cursor="view"
              aria-pressed={on}
              onClick={() => onToggle(w.id)}
              aria-label={on ? `Remove ${w.title} from your order` : `Add ${w.title} to your order`}
              className="group relative flex cursor-pointer flex-col gap-3 border-0 bg-transparent p-0 text-left font-sans text-primary"
            >
              <span
                className="relative overflow-hidden rounded-ui bg-wall shadow-hang outline-2 outline-offset-4 outline-transparent transition-[outline-color] duration-400 ease-gallery group-aria-pressed:outline-link"
                style={{ aspectRatio: ratioOf(w) }}
              >
                <img src={w.img} alt="" loading="lazy" className={imgClass(w, 'transition-transform duration-1200 ease-gallery group-hover:scale-[1.04]')} />
                <span
                  aria-hidden="true"
                  className="absolute top-2.5 right-2.5 flex size-9 items-center justify-center rounded-full border border-line bg-[rgba(255,254,250,.94)] text-primary transition-[background-color,color,transform] duration-400 ease-gallery group-aria-pressed:scale-[1.08] group-aria-pressed:border-link group-aria-pressed:bg-link group-aria-pressed:text-on-primary"
                >
                  <Icon name={on ? 'check' : 'plus'} size={18} strokeWidth={on ? 2 : 1.75} />
                </span>
              </span>
              <span className="eyebrow">{plateLabel(w)}</span>
              <span className="font-display text-xl/6 font-medium">{w.title}</span>
              <span className="flex items-baseline justify-between gap-2">
                <span className="meta">{w.size}</span>
                <span className="price">{w.price}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <p className="eyebrow">Not available to order</p>
        <p className="meta mt-2 mb-5">Sold, archived or made-to-order work. Commission something in its spirit instead.</p>
        <div className="grid grid-cols-4 items-start gap-5 max-lg:grid-cols-3 max-sm:grid-cols-2">
          {unavailable.map((w) => (
            <UnavailableCard key={w.id} work={w} />
          ))}
        </div>
      </div>

      <div className={NAV_ROW}>
        <TextLink to="/shop">Back to the shop</TextLink>
        <Button data-magnetic arrow onClick={onContinue} aria-disabled={selection.length === 0}>
          Continue to Your Details
        </Button>
      </div>
      {pickError && (
        <FieldError className="m-0" role="alert">
          Choose at least one original to continue.
        </FieldError>
      )}
    </div>
  );
}

/* sold, archived or made-to-order work leads to a commission instead */
function UnavailableCard({ work }) {
  return (
    <Link
      to="/commission"
      data-cursor="talk"
      aria-label={`${work.title}, ${STATUS[work.status].label}. Commission something similar`}
      className="flex flex-col gap-2 text-primary underline opacity-[.82] hover:text-primary"
    >
      <span className="relative overflow-hidden rounded-ui bg-wall saturate-[.9]" style={{ aspectRatio: ratioOf(work) }}>
        <img src={work.img} alt="" loading="lazy" className={imgClass(work)} />
      </span>
      <span className="font-display text-[17px]/[21px] font-medium">{work.title}</span>
      <StatusBadge status={work.status} className="text-[12px]!" />
    </Link>
  );
}

/* ------------------------------------------------------------------ 2 · details */
export function DetailsStep({ form, errors, onChange, onBack, onSubmit }) {
  const field = (name, id) => ({ name, value: form[name], onChange, ...describe(id, { error: errors[name] }) });
  const collect = form.delivery === 'collect';

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
          <Input type="email" autoComplete="email" {...field('email', 'o-email')} />
        </Field>
      </FieldRow>
      <Field id="o-phone" label="Phone" hint="Helpful for delivery. Optional." className="max-w-[360px]">
        <Input type="tel" autoComplete="tel" name="phone" value={form.phone} onChange={onChange} {...describe('o-phone', { hint: true })} />
      </Field>

      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-3 p-0 text-[13px]/5 font-semibold">How would you like to receive it? *</legend>
        <ChoiceGrid>
          <ChoiceCard name="delivery" value="ship" checked={!collect} onChange={onChange} title="Ship to me">
            Packed with care. Shipping is confirmed with your order.
          </ChoiceCard>
          <ChoiceCard name="delivery" value="collect" checked={collect} onChange={onChange} title="Collect from the studio">
            {CONTACT.location} · by appointment
          </ChoiceCard>
        </ChoiceGrid>
      </fieldset>

      {!collect && (
        <div className="flex flex-col gap-6">
          <Field id="o-addr" label="Address *" error={errors.address}>
            <Input type="text" autoComplete="street-address" {...field('address', 'o-addr')} />
          </Field>
          <FieldRow cols="three">
            <Field id="o-city" label="City *" error={errors.city}>
              <Input type="text" autoComplete="address-level2" {...field('city', 'o-city')} />
            </Field>
            <Field id="o-state" label="State">
              <Input type="text" autoComplete="address-level1" {...field('state', 'o-state')} />
            </Field>
            <Field id="o-pin" label="PIN code *" error={errors.pin}>
              <Input type="text" inputMode="numeric" autoComplete="postal-code" {...field('pin', 'o-pin')} />
            </Field>
          </FieldRow>
          <Field id="o-country" label="Country" className="max-w-[360px]">
            <Input type="text" autoComplete="country-name" {...field('country', 'o-country')} />
          </Field>
        </div>
      )}

      <Field id="o-note" label="A note for the artist" hint="A gift message, framing questions, a deadline. Optional.">
        <Textarea name="note" value={form.note} onChange={onChange} className="min-h-[110px]!" {...describe('o-note', { hint: true })} />
      </Field>

      <div className={NAV_ROW}>
        <TextLink onClick={onBack}>Back to your works</TextLink>
        <Button type="submit" data-magnetic arrow>
          Review Your Order
        </Button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ 3 · review */
export function ReviewStep({ form, ack, ackError, sending, onAck, onEdit, onSubmit }) {
  const receiving =
    form.delivery === 'collect'
      ? `Collect from the studio, ${CONTACT.location}`
      : [form.address, form.city, form.state, form.pin, form.country].filter(Boolean).join(', ');

  return (
    <form noValidate onSubmit={onSubmit} aria-labelledby="rev-h" className="flex flex-col gap-6">
      <StepHeading step={3} id="rev-h" title="Review your order request" />
      <div className="bg-surface p-6">
        <div className="flex items-baseline justify-between gap-4">
          <p className="eyebrow">Your details</p>
          <button type="button" onClick={onEdit} className="h-8 cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] font-semibold text-link">
            Edit
          </button>
        </div>
        <dl className={cx(REVIEW_LIST, 'mt-3')}>
          <dt>Name</dt>
          <dd>{form.name}</dd>
          <dt>Email</dt>
          <dd>{form.email}</dd>
          <dt>Phone</dt>
          <dd>{form.phone || 'Not given'}</dd>
          <dt>Receiving</dt>
          <dd>{receiving}</dd>
          <dt>Note</dt>
          <dd>{form.note || 'None'}</dd>
        </dl>
      </div>
      <div className="bg-surface p-6">
        <p className="eyebrow">What happens next</p>
        <ol className="mt-3 list-decimal pl-5 text-sm/6 text-soft">
          <li>I check each work is still available and confirm shipping.</li>
          <li>You receive a confirmation and a secure payment link by email.</li>
          <li>Once paid, your painting is packed and sent, or ready to collect.</li>
        </ol>
      </div>
      <Checkbox name="ack" checked={ack} onChange={(e) => onAck(e.target.checked)} aria-invalid={ackError || undefined} aria-describedby={ackError ? 'oe-ack' : undefined}>
        I understand this is an order request. Payment happens only after the artist confirms.
      </Checkbox>
      {ackError && (
        <FieldError id="oe-ack" role="alert">
          Tick the box above to send your request.
        </FieldError>
      )}
      <div className={NAV_ROW}>
        <TextLink onClick={onEdit}>Back to your details</TextLink>
        <Button type="submit" data-magnetic aria-busy={sending}>
          {sending ? 'Preparing…' : 'Send Order Request'}
        </Button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ done */
export function OrderDone({ firstName, onRestart }) {
  return (
    <FormSuccess
      eyebrow="Order request ready"
      name={firstName || 'there'}
      titleClassName="heading-2"
      className="gap-6"
      notConnected="This order page isn’t connected yet, so nothing has been sent or charged. When it’s live, your request comes straight to me and you’ll get a confirmation email with a secure payment link."
    >
      <p className="lead">
        For now, you can write to <Link to="/contact" className="underline">{CONTACT.email}</Link> with the works you chose.
      </p>
      <div className="flex flex-wrap gap-4">
        <Button variant="secondary" to="/shop">
          Back to the Shop
        </Button>
        <Button onClick={onRestart}>Start a New Order</Button>
      </div>
    </FormSuccess>
  );
}
