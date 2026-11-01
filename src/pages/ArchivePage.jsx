import cx from '@/utils/cx';
import { STATUS, availableWorks, getCollection, getWork, metaLine, plateLabel, ratioOf } from '@/data/works';
import ArtLink from '@/components/art/ArtLink';
import InverseSection from '@/components/sections/InverseSection';
import { PageMandala } from '@/components/mandala/Mandala';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import TextLink from '@/components/ui/TextLink';
import { Accent, Line, SplitWords } from '@/components/ui/Typography';

const ARCHIVE = ['chalk', 'mural', 'ganesha', 'child'].map(getWork);
const [chalk, mural, ganesha, child] = ARCHIVE;

const ARCHIVE_NO = 'font-display text-[clamp(72px,9vw,140px)] leading-[.85] font-light';
const NOTE = 'mt-6 max-w-[34ch] font-display text-[clamp(22px,2vw,28px)] leading-[1.35] italic';
const collectionOf = (w) => getCollection(w.collection).title;

/* museum label under a full-width plate: number · title and note · status and actions */
function PlateLabel({ work, id, numberClass, inverse = false, status, children }) {
  return (
    <div className="mt-10 grid grid-cols-12 items-start gap-x-8">
      <span aria-hidden="true" data-cap className={cx(ARCHIVE_NO, numberClass, 'col-[1/4] max-lg:col-span-full')}>
        {work.archiveNo}
      </span>
      <div data-cap className="col-[4/9] max-lg:col-span-full max-lg:mt-6">
        <p className="eyebrow">
          Archive Nº {work.archiveNo} · {collectionOf(work)}
        </p>
        <h2 id={id} className="mt-2.5 font-display text-4xl/10 font-normal">
          {work.title}
        </h2>
        <p className={cx('meta mt-2', inverse && 'text-on-primary-muted!')}>
          {metaLine(work)} · {work.year}
        </p>
        <p className={NOTE}>{work.note}</p>
      </div>
      <div data-cap className="col-[9/13] flex flex-col items-start gap-4 max-lg:col-span-full max-lg:mt-6">
        {status}
        {children}
      </div>
    </div>
  );
}

/* half image, half story; `reverse` mirrors it */
function ArchiveSplit({ work, id, numberClass, status, action, reverse = false, className }) {
  return (
    <section id={`n${work.archiveNo}`} aria-labelledby={id} className={className}>
      <div className="wrap">
        <div className="grid grid-cols-12 items-center gap-x-8">
          <div className={cx('max-lg:col-span-full max-lg:row-auto', reverse ? 'col-[7/13] row-1' : 'col-[1/7]')}>
            <ArtLink work={work} className={cx('max-w-[520px]', reverse && 'ml-auto')} />
          </div>
          <div data-cap className={cx('max-lg:col-span-full max-lg:row-auto max-lg:mt-10', reverse ? 'col-[1/6] row-1' : 'col-[8/13]')}>
            <span aria-hidden="true" className={cx(ARCHIVE_NO, numberClass, 'block')}>
              {work.archiveNo}
            </span>
            <p className="eyebrow mt-6">
              Archive Nº {work.archiveNo} · {collectionOf(work)}
            </p>
            <h2 id={id} className="heading-2 mt-3 font-light">
              {work.title}
            </h2>
            <p className="meta mt-2.5">
              {metaLine(work)} · {work.year}
            </p>
            <p className={NOTE}>{work.note}</p>
            <div className="mt-8 flex flex-col items-start gap-4">
              {status}
              {action}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeCard({ work, className }) {
  return (
    <figure className={cx('m-0', className)}>
      <ArtLink work={work} />
      <figcaption data-cap className="mt-[18px] flex items-baseline justify-between gap-4">
        <span>
          <span className="eyebrow block">{plateLabel(work)}</span>
          <span className="art-title">{work.title}</span>
        </span>
        <span className="price">{work.price}</span>
      </figcaption>
    </figure>
  );
}

export default function ArchivePage() {
  const [homeA, homeB = homeA] = availableWorks();

  return (
    <>
      {/* ============================== THE UNCOLLECTABLE COLLECTION (dark opening) */}
      <InverseSection aria-labelledby="ar-h" className="pt-[clamp(48px,6vw,96px)] pb-[clamp(64px,8vw,120px)]">
        <PageMandala stroke="#FFFEFA" accentRing={false} className="-top-[200px] -right-[260px] w-[820px] opacity-10" />
        <div className="wrap relative">
          <Breadcrumbs inverse items={[{ label: 'Home', to: '/' }, { label: 'Archive' }]} />
          <div className="grid-12 mt-8">
            <div className="col-[1/8] max-lg:col-span-full">
              <p data-intro className="eyebrow">
                The archive · Not for sale
              </p>
              <h1 id="ar-h" data-intro-line className="heading-1 mt-5">
                <Line>
                  The <Accent>uncollectable</Accent>
                </Line>
                <Line>collection.</Line>
              </h1>
              <p data-intro className="lead mt-7">
                Some works have already found their walls. Murals stay where they were painted. They live here as part of the story, kept and numbered, never as empty shelves.
              </p>
            </div>
            <nav aria-label="Archive index" className="col-[9/13] self-end max-lg:col-span-full max-lg:mt-12">
              <p data-intro className="eyebrow mb-3.5">
                Archive index
              </p>
              <ol data-intro className="m-0 list-none border-t border-[rgba(255,254,250,.24)] p-0">
                {ARCHIVE.map((w) => (
                  <li key={w.id}>
                    <a
                      href={`#n${w.archiveNo}`}
                      className="grid grid-cols-[56px_1fr_auto] items-baseline gap-3 border-b border-[rgba(255,254,250,.14)] py-4 text-sm/[22px] transition-[padding] duration-600 ease-gallery hover:pl-2.5"
                    >
                      <span className="text-on-primary-muted tabular-nums">Nº {w.archiveNo}</span>
                      <span className="font-display text-xl">{w.title}</span>
                      <span className="text-on-primary-muted">{STATUS[w.status].label}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </InverseSection>

      {/* ============================== Nº 014 — on the dark wall */}
      <InverseSection id={`n${chalk.archiveNo}`} aria-labelledby="t014" className="pb-[clamp(88px,10vw,144px)]">
        <div className="wrap">
          <div className="mx-auto max-w-[1180px]">
            <div data-reveal data-cursor="view" className="relative overflow-hidden bg-[#2C2B28]" style={{ aspectRatio: ratioOf(chalk) }}>
              <img src={chalk.img} alt={chalk.alt} loading="lazy" className="block size-full object-cover" />
            </div>
            <PlateLabel
              work={chalk}
              id="t014"
              inverse
              numberClass="text-outline-oak"
              status={<StatusBadge status="archived" tone="text-on-primary" suffix=" · stays on its wall" />}
            >
              <Button variant="light" to="/commission" data-magnetic data-cursor="talk">
                Commission a Wall
              </Button>
              <TextLink to={`/artwork/${chalk.id}`} tone="inverse">
                Open in the viewing room
              </TextLink>
            </PlateLabel>
          </div>
        </div>
      </InverseSection>

      {/* ============================== Nº 011 — full bleed */}
      <section id={`n${mural.archiveNo}`} aria-labelledby="t011" className="py-[clamp(88px,10vw,144px)]">
        <div data-reveal data-cursor="view" className="relative max-h-[86vh] w-full overflow-hidden bg-wall" style={{ aspectRatio: ratioOf(mural) }}>
          <img src={mural.img} alt={mural.alt} loading="lazy" className="block size-full object-cover" />
        </div>
        <div className="wrap">
          <PlateLabel work={mural} id="t011" numberClass="text-outline-secondary" status={<StatusBadge status="archived" suffix=" · painted on site" />}>
            <Button to="/commission" data-magnetic data-cursor="talk">
              Commission a Wall
            </Button>
            <TextLink to={`/artwork/${mural.id}`}>Open in the viewing room</TextLink>
          </PlateLabel>
        </div>
      </section>

      {/* ============================== Nº 009 — split */}
      <ArchiveSplit
        work={ganesha}
        id="t009"
        numberClass="text-outline-secondary"
        className="pb-[clamp(88px,10vw,144px)]"
        status={<StatusBadge status="sold" />}
        action={
          <Button to="/commission" data-magnetic data-cursor="talk">
            Commission Something Similar
          </Button>
        }
      />

      {/* ============================== Nº 006 — split, reversed */}
      <ArchiveSplit
        work={child}
        id="t006"
        reverse
        numberClass="text-outline-link"
        className="bg-wall py-[clamp(88px,10vw,144px)]"
        status={<StatusBadge status="inquiry" suffix=" · an example of personal work" />}
        action={
          <Button to="/commission" data-magnetic data-cursor="talk">
            Enquire About a Portrait
          </Button>
        }
      />

      {/* ============================== STILL LOOKING FOR A HOME */}
      <section aria-labelledby="home-h" className="py-[clamp(96px,11vw,160px)]">
        <div className="wrap">
          <div className="mb-[clamp(48px,6vw,88px)] flex flex-wrap items-end justify-between gap-6">
            <div>
              <p data-eyebrow className="eyebrow">
                Currently available
              </p>
              <SplitWords id="home-h" text="Still looking for a *home.*" className="heading-2 mt-5 font-light" />
            </div>
            <TextLink to="/shop" arrow data-cursor="explore">
              Visit the shop
            </TextLink>
          </div>
          <div className="grid grid-cols-12 items-start gap-x-8">
            <HomeCard work={homeA} className="col-[1/6] max-lg:col-span-6 max-sm:col-span-full" />
            <HomeCard work={homeB} className="col-[7/11] max-lg:col-span-6 max-sm:col-span-full" />
          </div>
        </div>
      </section>
    </>
  );
}
