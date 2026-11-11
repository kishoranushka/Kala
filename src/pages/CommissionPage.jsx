import { useState } from 'react';
import { CONTACT, EMAIL_PATTERN } from '@/data/site';
import cx from '@/utils/cx';
import { PHOTOS, getWork } from '@/data/works';
import { useFormFlow } from '@/hooks/useFormFlow';
import { SEND_ERROR, sendForm } from '@/utils/sendForm';
import Notice from '@/components/ui/Notice';
import FormSuccess from '@/components/form/FormSuccess';
import { Checkbox, ChoiceCard, ChoiceGrid, ErrorIcon, ErrorSummary, Field, FieldError, FieldRow, Input, Select, Textarea, describe } from '@/components/form/Fields';
import PageTop from '@/components/sections/PageTop';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { Accent, Line, SplitWords } from '@/components/ui/Typography';

const CHILD = getWork('child');
const MURAL = getWork('mural');
const TILES = [
  { img: PHOTOS.jacketBack.img, alt: 'The back of an olive jacket hand-painted with a large monarch butterfly', label: 'Painted wearables' },
  { img: CHILD.img, alt: 'A painted portrait of a sleeping child resting their chin in both hands, in rose and violet', label: 'Portraits & paintings', position: '50% 35%' },
  { img: MURAL.img, alt: 'A half-mandala wall mural in crimson, saffron, lilac and turquoise', label: 'Wall murals' },
];

const KINDS = [
  { value: 'painting', title: 'A painting', note: 'For a room, a person or a moment' },
  { value: 'mural', title: 'A wall mural', note: 'Homes, cafés, schools, studios' },
  { value: 'portrait', title: 'A portrait', note: 'Someone you love, painted' },
  { value: 'wearable', title: 'Painted wearable', note: 'Your design on a t-shirt, jacket, shoes and more' },
  { value: 'available', title: 'A work in the shop', note: 'A question about an original' },
];

const STEPS = [
  { title: 'Share', note: 'Tell me about the idea, the space, a reference or a feeling. Rough is fine.' },
  { title: 'Talk', note: 'We talk it through: size, colours, mood, and what matters most to you.' },
  { title: 'Sketch & quote', note: 'I share a direction and a quote. Nothing begins until you’re happy with both.' },
  { title: 'Paint & deliver', note: 'I paint, share progress, and deliver or paint it on site.' },
];

function validate({ kind, name = '', email = '', message = '' }) {
  const errors = {};
  if (!kind) errors.kind = 'Choose what you’d like to talk about.';
  if (!name.trim()) errors.name = 'Add your name so I know who to reply to.';
  if (!email.trim()) errors.email = 'Add your email so I can reply.';
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Add the rest of your email so I can reply, like name@example.com.';
  if (message.trim().length < 10) errors.message = 'Tell me a little more: a few words about your idea.';
  return errors;
}

const sendEnquiry = (v) =>
  sendForm({
    subject: `New commission enquiry: ${KINDS.find((k) => k.value === v.kind)?.title ?? v.kind} from ${v.name.trim()}`,
    name: v.name.trim(),
    email: v.email.trim(),
    botcheck: v.botcheck,
    fields: {
      'About': KINDS.find((k) => k.value === v.kind)?.title,
      'Idea': v.message.trim(),
      'Approximate size': v.size,
      'Budget range': v.budget,
      'Timeline': v.timeline,
      'Where it will live': v.space?.trim(),
      'Updates on new work': v.updates ? 'Yes, please' : 'No',
    },
  });

const FORM_HEADING ='mt-3 font-display text-[clamp(32px,3.4vw,48px)] leading-[1.06] font-light tracking-[-.01em]';

function EnquiryForm() {
  const { formRef, errors, sending, failed, failMessage, done, result, submit, reset } = useFormFlow(validate, sendEnquiry);
  const [more, setMore] = useState(false);
  const [files, setFiles] = useState([]);

  if (done) {
    return (
      <FormSuccess
        name={result.name.trim().split(' ')[0]}
        titleClassName="text-[clamp(32px,3.4vw,48px)] leading-[1.06]"
        className="gap-7"
      >
        <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 border-y border-divider py-5 text-sm/[22px]">
          <dt className="meta">About</dt>
          <dd className="m-0 font-semibold">{KINDS.find((k) => k.value === result.kind)?.title}</dd>
          <dt className="meta">Reply to</dt>
          <dd className="m-0 font-semibold">{result.email}</dd>
        </dl>
        <p className="meta">
          Your enquiry is with me. I’ll reply soon{files.length > 0 ? ', and ask for your reference images then' : ''}.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="secondary"
            onClick={() => {
              reset();
              setFiles([]);
              setMore(false);
            }}
          >
            Start Over
          </Button>
          <Button to="/shop" data-cursor="explore">
            Explore the Art
          </Button>
        </div>
      </FormSuccess>
    );
  }

  const count = Object.keys(errors).length;
  return (
    <form ref={formRef} noValidate onSubmit={submit} aria-labelledby="form-h" className="flex flex-col gap-7">
      <div>
        <p className="eyebrow">Your enquiry</p>
        <h2 id="form-h" className={FORM_HEADING}>
          Tell me about it.
        </h2>
        <p className="meta mt-2.5">Fields marked * are needed so I can reply. Everything else is optional.</p>
      </div>

      <ErrorSummary count={count} />

      <fieldset className="m-0 border-0 p-0" aria-describedby={errors.kind ? 'e-kind' : undefined}>
        <legend className="mb-3 p-0 text-[13px]/5 font-semibold">What would you like to talk about? *</legend>
        <ChoiceGrid>
          {KINDS.map((k) => (
            <ChoiceCard key={k.value} name="kind" value={k.value} title={k.title} aria-invalid={errors.kind ? true : undefined}>
              {k.note}
            </ChoiceCard>
          ))}
        </ChoiceGrid>
        <FieldError id="e-kind" className="mt-2.5">
          {errors.kind && (
            <>
              <ErrorIcon />
              {errors.kind}
            </>
          )}
        </FieldError>
      </fieldset>

      <FieldRow>
        <Field id="f-name" label="Your name *" error={errors.name}>
          <Input name="name" type="text" autoComplete="name" {...describe('f-name', { error: errors.name })} />
        </Field>
        <Field id="f-email" label="Email *" error={errors.email}>
          <Input name="email" type="email" autoComplete="email" inputMode="email" {...describe('f-email', { error: errors.email })} />
        </Field>
      </FieldRow>

      <Field id="f-msg" label="Your idea *" hint="A few lines is plenty: what you imagine, where it will live, what it should feel like." error={errors.message}>
        <Textarea name="message" {...describe('f-msg', { hint: true, error: errors.message })} />
      </Field>

      <div>
        <button
          type="button"
          aria-expanded={more}
          aria-controls="more-fields"
          onClick={() => setMore((m) => !m)}
          className="group inline-flex min-h-11 cursor-pointer items-center gap-2.5 border-0 border-b border-primary bg-transparent p-0 font-sans text-sm font-semibold text-primary"
        >
          Add project details (optional)
          <Icon name="plus" size={16} strokeWidth={1.75} className="transition-transform duration-500 ease-gallery group-aria-expanded:rotate-45" />
        </button>
      </div>

      <div id="more-fields" hidden={!more} className="flex flex-col gap-7">
        <FieldRow>
          <Field id="f-size" label="Approximate size">
            <Select id="f-size" name="size" tall>
              <option value="">Not sure yet</option>
              <option>Small · up to 60 cm</option>
              <option>Medium · 60–120 cm</option>
              <option>Large · over 120 cm</option>
              <option>A whole wall</option>
            </Select>
          </Field>
          <Field id="f-budget" label="Budget range">
            <Select id="f-budget" name="budget" tall>
              <option value="">Prefer to discuss</option>
              <option>Under ₹5,000</option>
              <option>₹5,000 – ₹15,000</option>
              <option>₹15,000 – ₹40,000</option>
              <option>Above ₹40,000</option>
            </Select>
          </Field>
        </FieldRow>
        <FieldRow>
          <Field id="f-when" label="Timeline">
            <Select id="f-when" name="timeline" tall>
              <option value="">Flexible</option>
              <option>Within a month</option>
              <option>One to three months</option>
              <option>For a specific date</option>
            </Select>
          </Field>
          <Field id="f-space" label="Where it will live">
            <Input id="f-space" name="space" type="text" placeholder="Living room, café wall…" />
          </Field>
        </FieldRow>
        <div className="flex flex-col items-start gap-2 rounded-ui border border-dashed border-line bg-page p-5">
          <label htmlFor="f-files" className="text-[13px]/5 font-semibold">
            Reference images
          </label>
          <span className="text-xs/[18px] text-muted">Photos of the space, sketches, paintings you love. JPG or PNG.</span>
          <input
            id="f-files"
            name="files"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files ?? [], (f) => f.name))}
            className="font-sans text-[13px]"
          />
          {files.length > 0 && (
            <span className="meta">
              {files.length} {files.length === 1 ? 'image chosen' : 'images chosen'}: {files.join(', ')}. Images aren’t uploaded here; I’ll ask you to email them when I reply.
            </span>
          )}
        </div>
      </div>

      <Checkbox name="updates">Send me occasional updates on new work. I never share your details.</Checkbox>
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      {failed && (
        <Notice tone="error" role="alert">
          {failMessage || SEND_ERROR}
        </Notice>
      )}

      <div className="flex flex-wrap items-center gap-5">
        <Button type="submit" data-magnetic data-cursor="talk" aria-busy={sending}>
          {sending ? 'Sending…' : 'Send Enquiry'}
        </Button>
        <span className="meta">Your details are used only to reply to you.</span>
      </div>
    </form>
  );
}

export default function CommissionPage() {

  return (
    <>
      {/* ============================== BEGIN WITH AN IDEA */}
      <PageTop labelledBy="ct-h" crumbs={[{ label: 'Commission' }]} bodyClassName="mt-8 grid-12">
        <div className="col-[1/7] self-center max-lg:col-span-full">
          <p data-intro className="eyebrow">
            Commissions · Begin here
          </p>
          <h1 id="ct-h" data-intro-line className="heading-1 mt-5">
            <Line>Begin with</Line>
            <Line className="pl-[14%]">
              an <Accent>idea.</Accent>
            </Line>
          </h1>
          <p data-intro className="lead mt-7">
            A painting for a room, a portrait of someone you love, a wall waiting for a story, or a question about a work in the shop. Write to me; I read every message personally.
          </p>
          <div data-intro className="mt-9 flex flex-wrap gap-4">
            <Button to="#enquiry" arrow="arrowDown" data-magnetic data-cursor="talk">
              Start Your Enquiry
            </Button>
            <Button to="#how" variant="secondary">
              How a commission works
            </Button>
          </div>
        </div>
        <div aria-label="Things I can make for you" className="col-[8/13] grid h-[clamp(460px,44vw,620px)] grid-cols-2 grid-rows-2 gap-4 max-lg:col-span-full max-lg:mt-12 max-lg:max-w-[560px]">
          {TILES.map((tile, i) => (
            <figure key={tile.label} data-intro className={cx('group relative m-0 overflow-hidden rounded-ui bg-wall shadow-hang', i === 0 && 'row-span-2')}>
              <img
                src={tile.img}
                alt={tile.alt}
                fetchpriority={i === 0 ? 'high' : undefined}
                loading={i === 0 ? undefined : 'lazy'}
                className="block size-full object-cover transition-transform duration-1400 ease-gallery group-hover:scale-105"
                style={tile.position ? { objectPosition: tile.position } : undefined}
              />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-surface/92 px-3 py-1.5 text-xs/4 font-semibold text-primary">{tile.label}</figcaption>
            </figure>
          ))}
        </div>
      </PageTop>

      {/* ============================== HOW A COMMISSION WORKS */}
      <section id="how" aria-labelledby="how-h" className="pt-[clamp(48px,6vw,88px)] pb-[clamp(96px,11vw,160px)]">
        <div className="wrap">
          <p data-eyebrow className="eyebrow">
            How a commission works
          </p>
          <SplitWords id="how-h" text="Four steps, one *conversation* at a time." className="heading-2 mt-5 max-w-[18ch] font-light" />
          <ol data-stagger className="mt-[clamp(48px,6vw,80px)] grid list-none grid-cols-4 gap-8 p-0 max-lg:grid-cols-2 max-lg:gap-y-10 max-sm:grid-cols-1">
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative pt-7 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-line">
                <span className="font-display text-[44px] leading-none text-secondary italic">0{i + 1}</span>
                <p className="art-title mt-4">{step.title}</p>
                <p className="meta mt-2 text-sm/[22px] text-soft!">{step.note}</p>
              </li>
            ))}
          </ol>
          <p data-cap className="meta mt-10">
            Pricing and timelines are agreed per project. Sending an idea doesn’t commit either of us.
          </p>
        </div>
      </section>

      {/* ============================== THE ENQUIRY */}
      <section id="enquiry" aria-labelledby="form-h" className="pb-[clamp(96px,11vw,160px)]">
        <div className="wrap">
          <div className="grid-12 items-start">
            <aside data-cap className="col-[1/5] max-lg:col-span-full">
              <p className="eyebrow">Prefer to write directly?</p>
              <ul className="mt-5 list-none border-t border-divider p-0">
                {[
                  ['Email', <a key="e" href={`mailto:${CONTACT.email}`} className="font-display text-2xl/[30px] break-words text-primary no-underline hover:text-link">{CONTACT.email}</a>],
                  ['Instagram', <a key="i" href={CONTACT.instagram} target="_blank" rel="noopener" className="font-display text-2xl/[30px] text-primary no-underline hover:text-link">{CONTACT.instagramHandle}</a>],
                  ['Based in', <span key="s" className="font-display text-2xl/[30px]">{CONTACT.location}</span>],
                ].map(([label, value]) => (
                  <li key={label} className="flex flex-col gap-0.5 border-b border-divider py-4">
                    <span className="meta">{label}</span>
                    {value}
                  </li>
                ))}
              </ul>
              <p className="mt-8 max-w-[20ch] font-display text-[26px]/[34px] italic">I read every message personally.</p>
            </aside>

            <div data-cap className="col-[6/13] bg-surface p-[clamp(28px,4vw,56px)] shadow-[0_1px_0_var(--color-divider)] max-lg:col-span-full max-lg:mt-12 max-sm:-mx-5">
              <EnquiryForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
