import { Fragment, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { POLICIES, POLICY_ORDER, UPDATED } from '@/data/policies';
import PageTop from '@/components/sections/PageTop';
import SmartLink from '@/components/ui/SmartLink';
import TextLink from '@/components/ui/TextLink';
import { Accent, Line } from '@/components/ui/Typography';

const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;
const EMPHASIS = /\*([^*]+)\*/;

/* "[text](/path)" → links; in-page "#id" anchors stay plain anchors */
function Rich({ text }) {
  const out = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    out.push(text.slice(last, m.index));
    const [, label, to] = m;
    out.push(
      to.startsWith('#') ? (
        <a key={m.index} href={to}>
          {label}
        </a>
      ) : (
        <SmartLink key={m.index} to={to}>
          {label}
        </SmartLink>
      )
    );
    last = m.index + m[0].length;
  }
  out.push(text.slice(last));
  return out.map((part, i) => (typeof part === 'string' ? <Fragment key={`t${i}`}>{part}</Fragment> : part));
}

/* a heading line with one *accented* phrase */
function HeadingLine({ text, className }) {
  const [before, accent, after] = text.split(EMPHASIS);
  return (
    <Line className={className}>
      {before}
      {accent && <Accent>{accent}</Accent>}
      {after}
    </Line>
  );
}

function Block({ block }) {
  if (typeof block === 'string') return <p><Rich text={block} /></p>;
  return (
    <ul>
      {block.list.map((item) => (
        <li key={item}>
          <Rich text={item} />
        </li>
      ))}
    </ul>
  );
}

/* prose styling for the policy body: paragraphs, bullet lists, inline links */
const PROSE =
  'flex flex-col gap-4 text-[15px]/[26px] text-soft [&_p]:m-0 [&_ul]:m-0 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5 ' +
  '[&_li]:pl-1 [&_li]:marker:text-secondary [&_a]:font-semibold [&_a]:text-link [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-primary';

/* Shipping, returns, terms, privacy and cookie policies share this page; the text lives in src/data/policies.js */
export default function PolicyPage() {
  const { pathname, hash } = useLocation();
  const path = pathname.replace(/\/+$/, '') || '/';
  const policy = POLICIES[path];

  /* arriving from another page at "/returns#damage": scroll to the section once the curtain has lifted */
  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView(), 900);
    return () => clearTimeout(t);
  }, [path]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!policy) return <Navigate to="/" replace />;
  const others = POLICY_ORDER.filter((p) => p !== path);

  return (
    <>
      <PageTop labelledBy="pol-h" crumbs={[{ label: policy.label }]} bodyClassName="mt-8 grid-12">
        <div className="col-[1/9] max-lg:col-span-full">
          <p data-intro className="eyebrow">
            {policy.eyebrow}
          </p>
          <h1 id="pol-h" data-intro-line className="heading-1 mt-5">
            <HeadingLine text={policy.lines[0]} />
            <HeadingLine text={policy.lines[1]} className="pl-[12%]" />
          </h1>
        </div>
        <div data-intro className="col-[9/13] self-end max-lg:col-span-full max-lg:mt-7">
          <p className="lead">{policy.lead}</p>
          <p className="meta mt-3.5">Last updated {UPDATED}</p>
        </div>
      </PageTop>

      <section aria-label={policy.label} className="pb-[clamp(96px,11vw,160px)]">
        <div className="wrap">
          <div className="grid-12 items-start">
            {/* contents + the other policies */}
            <aside className="sticky top-28 col-[1/4] flex flex-col gap-8 max-lg:static max-lg:col-span-full max-lg:mb-10">
              <nav aria-label="On this page" className="max-lg:hidden">
                <p className="eyebrow mb-3">On this page</p>
                <ol className="m-0 flex list-none flex-col gap-1 p-0">
                  {policy.sections.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="block py-1 text-sm/5 text-soft no-underline hover:text-link">
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
              <nav aria-label="Other policies">
                <p className="eyebrow mb-3">Other policies</p>
                <ul className="m-0 flex list-none flex-col gap-1 p-0 max-lg:flex-row max-lg:flex-wrap max-lg:gap-x-6">
                  {others.map((p) => (
                    <li key={p}>
                      <SmartLink to={p} className="block py-1 text-sm/5 font-semibold text-primary no-underline hover:text-link">
                        {POLICIES[p].label}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            <div className="col-[5/13] flex flex-col gap-[clamp(40px,4.5vw,64px)] max-lg:col-span-full">
              {/* in short */}
              <div data-cap className="bg-surface p-[clamp(28px,3.5vw,48px)] max-sm:-mx-5">
                <p className="eyebrow">In short</p>
                <ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
                  {policy.summary.map((line) => (
                    <li key={line} className="flex gap-3 font-display text-[clamp(20px,1.8vw,24px)] leading-[1.3]">
                      <span aria-hidden="true" className="mt-[.55em] size-1.5 shrink-0 rounded-full bg-secondary" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              {policy.sections.map((s, i) => (
                <article key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} data-reveal className="grid scroll-mt-32 grid-cols-[auto_1fr] gap-x-6 border-t border-divider pt-8 max-sm:grid-cols-1">
                  <span aria-hidden="true" className="font-display text-[28px] leading-none text-secondary italic max-sm:mb-3">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h2 id={`${s.id}-h`} className="m-0 font-display text-[clamp(26px,2.4vw,34px)] leading-[1.15] font-normal">
                      {s.title}
                    </h2>
                    <div className={`${PROSE} mt-4 max-w-[68ch]`}>
                      {s.body.map((block, j) => (
                        <Block key={j} block={block} />
                      ))}
                    </div>
                  </div>
                </article>
              ))}

              <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-divider pt-8">
                <p className="meta m-0">Something unclear?</p>
                <TextLink to="/contact" arrow>
                  Write to me
                </TextLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
