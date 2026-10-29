import { Link } from 'react-router-dom';
import { CONTACT, EMAIL_PATTERN } from '@/data/site';
import { STUDIO } from '@/data/works';
import { useFormFlow } from '@/hooks/useFormFlow';
import FormSuccess from '@/components/form/FormSuccess';
import { Checkbox, ErrorSummary, Field, FieldRow, Input, Select, Textarea, describe } from '@/components/form/Fields';
import PageIntro from '@/components/sections/PageIntro';
import Button from '@/components/ui/Button';
import Disclosure from '@/components/ui/Disclosure';
import Icon from '@/components/ui/Icon';
import { SplitWords } from '@/components/ui/Typography';

const WAYS = [
  { icon: 'mail', label: 'Email', value: CONTACT.email, href: '#message' },
  { icon: 'instagram', label: 'Instagram', value: CONTACT.instagram, href: '#top' },
  { icon: 'youtube', label: 'YouTube', value: CONTACT.youtube, href: '#top' },
  { icon: 'pin', label: 'Studio', value: CONTACT.location },
];

const ROUTES = [
  { to: '/commission', cursor: 'talk', label: 'Commission', tone: 'text-clay-ink!', title: 'A painting or wall, made for you', note: 'The commission form asks the right questions: space, size, timeline.' },
  { to: '/order', cursor: 'explore', label: 'Order', tone: 'text-success!', title: 'Buy an available original', note: 'Choose works, add your details, send an order request.' },
  { to: '/shop', cursor: 'explore', label: 'Shop', title: 'Browse every work', note: 'Available, sold and archived, all marked clearly.' },
];

const FAQ = [
  { q: 'Do you ship outside [your city or country]?', a: '[Your answer: where you ship, and how paintings are packed.]' },
  { q: 'How long does a commission take?', a: 'Timelines are agreed per project, once we’ve talked about size and detail. [Add a typical range if you’d like to.]' },
  { q: 'Can I see a painting in person?', a: '[Your answer: studio visits, collection from the studio, or video calls.]' },
  { q: 'Do you paint walls outside your city?', a: '[Your answer about travelling for murals.]' },
];

const ROW = 'grid min-h-[72px] grid-cols-[40px_120px_1fr_auto] items-center gap-4 text-ink max-sm:grid-cols-[28px_1fr] max-sm:gap-y-0.5 max-sm:py-3';

function validate({ name = '', email = '', message = '' }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Add your name so I know who to reply to.';
  if (!email.trim()) errors.email = 'Add your email so I can reply.';
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Add the rest of your email so I can reply, like name@example.com.';
  if (message.trim().length < 5) errors.message = 'Write a few words so I know how to help.';
  return errors;
}

/* the "o" of "hello" is a small turning mandala */
function MandalaO() {
  return (
    <svg
      viewBox="-60 -60 120 120"
      aria-hidden="true"
      data-intro
      fill="none"
      strokeWidth="2"
      className="mx-[.02em] inline-block size-[.62em] translate-y-[.06em] self-center"
    >
      <g data-spin="24">
        <circle r="56" stroke="#22211F" />
        <circle r="44" strokeWidth="5" strokeDasharray="0 11.5" strokeLinecap="round" className="stroke-accent" />
        <path
          d="M0,-40 C10,-30 10,-20 0,-12 C-10,-20 -10,-30 0,-40Z M0,40 C10,30 10,20 0,12 C-10,20 -10,30 0,40Z M-40,0 C-30,10 -20,10 -12,0 C-20,-10 -30,-10 -40,0Z M40,0 C30,10 20,10 12,0 C20,-10 30,-10 40,0Z"
          stroke="#22211F"
        />
      </g>
      <circle r="7" className="fill-accent" stroke="none" />
    </svg>
  );
}

function MessageForm() {
  const { formRef, errors, sending, done, result, submit, reset } = useFormFlow(validate, { delay: 800 });

  if (done) {
    return (
      <FormSuccess
        name={result.name.trim().split(' ')[0]}
        titleClassName="text-[clamp(32px,3.4vw,48px)] leading-[1.06]"
        className="gap-6"
        notConnected="This form isn’t connected yet, so nothing has been sent. When it’s live, your message comes straight to me and you’ll see a confirmation here."
      >
        <p className="meta">
          For now, write to <a href="#message" className="underline">{CONTACT.email}</a> directly.
        </p>
        <div>
          <Button variant="secondary" onClick={reset}>
            Write Another Message
          </Button>
        </div>
      </FormSuccess>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={submit} aria-labelledby="msg-h" className="flex flex-col gap-6">
      <div>
        <p className="eyebrow">Write to me</p>
        <h2 id="msg-h" className="mt-3 font-display text-[clamp(32px,3.4vw,48px)] leading-[1.06] font-light tracking-[-.01em]">
          What’s on your mind?
        </h2>
        <p className="meta mt-2.5">Fields marked * are needed so I can reply.</p>
      </div>
      <ErrorSummary count={Object.keys(errors).length} />
      <FieldRow>
        <Field id="c-name" label="Your name *" error={errors.name}>
          <Input name="name" type="text" autoComplete="name" {...describe('c-name', { error: errors.name })} />
        </Field>
        <Field id="c-email" label="Email *" error={errors.email}>
          <Input name="email" type="email" autoComplete="email" inputMode="email" {...describe('c-email', { error: errors.email })} />
        </Field>
      </FieldRow>
      <Field id="c-topic" label="Topic">
        <Select id="c-topic" name="topic" tall>
          <option>A question about a painting</option>
          <option>Shipping and delivery</option>
          <option>A collaboration or press</option>
          <option>Something else</option>
        </Select>
      </Field>
      <Field id="c-msg" label="Message *" error={errors.message}>
        <Textarea name="message" {...describe('c-msg', { error: errors.message })} />
      </Field>
      <Checkbox name="updates">Send me occasional studio updates. I never share your details.</Checkbox>
      <div className="flex flex-wrap items-center gap-5">
        <Button type="submit" data-magnetic aria-busy={sending}>
          {sending ? 'Preparing…' : 'Send Message'}
        </Button>
        <span className="meta">Your details are used only to reply to you.</span>
      </div>
    </form>
  );
}

export default function ContactPage() {
  return (
    <>
      {/* ============================== SAY HELLO */}
      <PageIntro labelledBy="hi-h" crumbs={[{ label: 'Contact' }]}>
        <div className="col-[1/7] max-lg:col-span-full">
          <p data-intro className="eyebrow">
            Contact
          </p>
          <h1
            id="hi-h"
            data-intro-line
            aria-label="Say hello."
            className="mt-5 flex flex-wrap items-baseline font-display text-[clamp(72px,11vw,176px)] leading-[.9] font-light tracking-[-.02em]"
          >
            <span className="lm" aria-hidden="true">
              <span className="li">Say&nbsp;hell</span>
            </span>
            <MandalaO />
            <span className="lm" aria-hidden="true">
              <span className="li">.</span>
            </span>
          </h1>
          <p data-intro className="lead mt-8">
            A question about a painting, shipping, a collaboration, or simply a hello. I read every message personally and reply as soon as I can.
          </p>
          <ul data-intro className="mt-10 grid list-none grid-cols-2 gap-x-8 border-t border-line p-0 max-sm:grid-cols-1">
            {WAYS.map((way) => {
              const content = (
                <>
                  <Icon name={way.icon} />
                  <span className="text-xs font-semibold tracking-[.12em] text-stone-ink uppercase max-sm:col-start-2">{way.label}</span>
                  <span className="font-display text-[clamp(22px,2.4vw,32px)] leading-[1.1] max-sm:col-start-2">{way.value}</span>
                  {way.href ? <Icon name="arrow" size={18} className="max-sm:hidden" /> : <span />}
                </>
              );
              return (
                <li key={way.label} className="border-b border-divider">
                  {way.href ? (
                    <a href={way.href} className={`${ROW} transition-[padding] duration-600 ease-gallery hover:pl-3 hover:text-ink`}>
                      {content}
                    </a>
                  ) : (
                    <span className={ROW}>{content}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col-[8/13] self-end max-lg:col-span-full max-lg:mt-12 max-lg:max-w-[460px]">
          <div data-intro-img data-tilt data-cursor="view" className="relative overflow-hidden bg-wall shadow-float" style={{ aspectRatio: `${STUDIO.easel.w} / ${STUDIO.easel.h}` }}>
            <img src={STUDIO.easel.img} alt={STUDIO.easel.alt} fetchpriority="high" className="block size-full object-cover" />
          </div>
          <p data-intro className="meta mt-3.5">
            On the desk · The Escape Key Exists for a Reason, 2026
          </p>
        </div>
      </PageIntro>

      {/* ============================== WRITE TO ME */}
      <section id="message" aria-labelledby="msg-h" className="pt-[clamp(48px,6vw,88px)] pb-[clamp(96px,11vw,160px)]">
        <div className="wrap">
          <div className="grid-12 items-start">
            <div data-cap className="col-[1/8] bg-paper p-[clamp(28px,4vw,56px)] max-lg:col-span-full max-sm:-mx-5">
              <MessageForm />
            </div>

            <aside data-stagger aria-label="Looking for something specific?" className="col-[9/13] flex flex-col gap-5 max-lg:col-span-full max-lg:mt-10">
              <p className="eyebrow">Looking for something specific?</p>
              {ROUTES.map((r) => (
                <Link
                  key={r.to}
                  to={r.to}
                  data-cursor={r.cursor}
                  className="flex flex-col gap-2.5 border border-divider bg-ivory p-7 text-ink transition-[border-color,transform] duration-600 ease-gallery hover:-translate-y-1 hover:border-ink hover:text-ink"
                >
                  <span className={`eyebrow ${r.tone ?? ''}`}>{r.label}</span>
                  <b className="font-display text-[28px]/8 font-normal">{r.title}</b>
                  <span className="meta">{r.note}</span>
                </Link>
              ))}
            </aside>
          </div>
        </div>
      </section>

      {/* ============================== BEFORE YOU WRITE */}
      <section aria-labelledby="faq-h" className="pb-[clamp(96px,11vw,160px)]">
        <div className="wrap">
          <div className="grid-12">
            <div className="col-[3/11] max-lg:col-span-full">
              <p data-eyebrow className="eyebrow">
                Before you write
              </p>
              <SplitWords id="faq-h" text="A few *quick* answers." className="heading-2 mt-5 font-light" />
              <div data-cap className="mt-10">
                {FAQ.map((item) => (
                  <Disclosure key={item.q} title={item.q}>
                    {item.a}
                  </Disclosure>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
