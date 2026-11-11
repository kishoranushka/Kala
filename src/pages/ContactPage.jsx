import { Link } from 'react-router-dom';
import { CONTACT, EMAIL_PATTERN } from '@/data/site';
import { PHOTOS } from '@/data/works';
import { useFormFlow } from '@/hooks/useFormFlow';
import { SEND_ERROR, sendForm } from '@/utils/sendForm';
import Notice from '@/components/ui/Notice';
import FormSuccess from '@/components/form/FormSuccess';
import { Checkbox, ErrorSummary, Field, FieldRow, Input, Select, Textarea, describe } from '@/components/form/Fields';
import PageTop from '@/components/sections/PageTop';
import Button from '@/components/ui/Button';
import Disclosure from '@/components/ui/Disclosure';
import Icon from '@/components/ui/Icon';
import { SplitWords } from '@/components/ui/Typography';

const WAYS = [
  { icon: 'mail', label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { icon: 'instagram', label: 'Instagram', value: CONTACT.instagramHandle, href: CONTACT.instagram, external: true },
  { icon: 'youtube', label: 'YouTube', value: CONTACT.youtubeHandle, href: CONTACT.youtube, external: true },
  { icon: 'pin', label: 'Based in', value: CONTACT.location },
];

const ROUTES = [
  { to: '/commission', cursor: 'talk', label: 'Commission', tone: 'text-secondary!', title: 'A painting or wall, made for you', note: 'The commission form asks the right questions: space, size, timeline.' },
  { to: '/order', cursor: 'explore', label: 'Order', tone: 'text-success!', title: 'Buy an available original', note: 'Choose works, add your details, pay securely online.' },
  { to: '/shop', cursor: 'explore', label: 'Shop', title: 'Browse every work', note: 'Available, sold and archived, all marked clearly.' },
];

const FAQ = [
  { q: 'Do you ship outside India?', a: 'Paintings ordered on this site ship free anywhere in India. I pack each one myself, wrapped and protected at the corners, and send it with a tracked courier. For delivery abroad, write to me first and we’ll work out shipping and customs together.' },
  { q: 'How long does a commission take?', a: 'It depends on the size and the detail: a small canvas takes far less time than a large portrait or a wall. Once we’ve talked it through, I’ll give you a clear timeline along with the quote, before any paint goes on.' },
  { q: 'Can I see a painting in person?', a: 'Most of my work lives online, so I’m happy to send more photographs, close-ups in daylight, or a short video of a painting before you decide. Just ask on the work’s page or write to me.' },
  { q: 'Do you paint walls outside your city?', a: 'Yes. I travel for murals within India. Tell me your city and the size of the wall, and travel and stay are included in the quote so there are no surprises.' },
];

const ROW = 'grid min-h-[72px] grid-cols-[40px_120px_1fr_auto] items-center gap-4 text-primary max-sm:grid-cols-[28px_1fr] max-sm:gap-y-0.5 max-sm:py-3';

function validate({ name = '', email = '', message = '' }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Add your name so I know who to reply to.';
  if (!email.trim()) errors.email = 'Add your email so I can reply.';
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Add the rest of your email so I can reply, like name@example.com.';
  if (message.trim().length < 5) errors.message = 'Write a few words so I know how to help.';
  return errors;
}

const sendMessage = (v) =>
  sendForm({
    subject: `New message from ${v.name.trim()}: ${v.topic}`,
    name: v.name.trim(),
    email: v.email.trim(),
    botcheck: v.botcheck,
    fields: {
      'Topic': v.topic,
      'Message': v.message.trim(),
      'Updates on new work': v.updates ? 'Yes, please' : 'No',
    },
  });

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
        <circle r="56" className="stroke-primary" />
        <circle r="44" strokeWidth="5" strokeDasharray="0 11.5" strokeLinecap="round" className="stroke-secondary" />
        <path
          d="M0,-40 C10,-30 10,-20 0,-12 C-10,-20 -10,-30 0,-40Z M0,40 C10,30 10,20 0,12 C-10,20 -10,30 0,40Z M-40,0 C-30,10 -20,10 -12,0 C-20,-10 -30,-10 -40,0Z M40,0 C30,10 20,10 12,0 C20,-10 30,-10 40,0Z"
          className="stroke-primary"
        />
      </g>
      <circle r="7" className="fill-secondary" stroke="none" />
    </svg>
  );
}

function MessageForm() {
  const { formRef, errors, sending, failed, failMessage, done, result, submit, reset } = useFormFlow(validate, sendMessage);

  if (done) {
    return (
      <FormSuccess
        name={result.name.trim().split(' ')[0]}
        titleClassName="text-[clamp(32px,3.4vw,48px)] leading-[1.06]"
        className="gap-6"
      >
        <p className="meta">Your message is with me. I’ll reply to {result.email} as soon as I can.</p>
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
      <Checkbox name="updates">Send me occasional updates on new work. I never share your details.</Checkbox>
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      {failed && (
        <Notice tone="error" role="alert">
          {failMessage || SEND_ERROR}
        </Notice>
      )}
      <div className="flex flex-wrap items-center gap-5">
        <Button type="submit" data-magnetic aria-busy={sending}>
          {sending ? 'Sending…' : 'Send Message'}
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
      <PageTop labelledBy="hi-h" crumbs={[{ label: 'Contact' }]} bodyClassName="mt-8 grid-12">
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
          <ul data-intro className="m-0 mt-10 list-none border-t border-line p-0">
            {WAYS.map((way) => {
              const content = (
                <>
                  <Icon name={way.icon} />
                  <span className="text-xs font-semibold tracking-[.12em] text-muted uppercase max-sm:col-start-2">{way.label}</span>
                  <span className="min-w-0 font-display text-[clamp(20px,2vw,28px)] leading-[1.15] [overflow-wrap:anywhere] max-sm:col-start-2">{way.value}</span>
                  {way.href ? <Icon name="arrow" size={18} className="max-sm:hidden" /> : <span />}
                </>
              );
              return (
                <li key={way.label} className="border-b border-divider">
                  {way.href ? (
                    <a href={way.href} {...(way.external ? { target: '_blank', rel: 'noopener' } : {})} className={`${ROW} no-underline transition-[padding] duration-600 ease-gallery hover:pl-3 hover:text-primary`}>
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
          <div data-intro-img className="relative ml-auto aspect-[4/5] max-w-[460px] overflow-hidden rounded-ui bg-wall shadow-float">
            <img src={PHOTOS.whiteTop.img} alt={PHOTOS.whiteTop.alt} fetchpriority="high" className="block size-full object-cover object-[50%_30%]" />
          </div>
          <p data-intro className="meta mt-3.5 mb-0 text-right">
            Hi, it’s me. Say hello any time.
          </p>
        </div>
      </PageTop>

      {/* ============================== WRITE TO ME */}
      <section id="message" aria-labelledby="msg-h" className="pt-[clamp(48px,6vw,88px)] pb-[clamp(96px,11vw,160px)]">
        <div className="wrap">
          <div className="grid-12 items-start">
            <div data-cap className="col-[1/8] bg-surface p-[clamp(28px,4vw,56px)] max-lg:col-span-full max-sm:-mx-5">
              <MessageForm />
            </div>

            <aside data-stagger aria-label="Looking for something specific?" className="col-[9/13] flex flex-col gap-5 max-lg:col-span-full max-lg:mt-10">
              <p className="eyebrow">Looking for something specific?</p>
              {ROUTES.map((r) => (
                <Link
                  key={r.to}
                  to={r.to}
                  data-cursor={r.cursor}
                  className="flex flex-col gap-2.5 rounded-ui border border-divider bg-page p-7 text-primary no-underline transition-[border-color,transform] duration-600 ease-gallery hover:-translate-y-1 hover:border-primary hover:text-primary"
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
