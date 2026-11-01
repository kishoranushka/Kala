import { Link } from 'react-router-dom';
import cx from '@/utils/cx';
import { COLLECTIONS, getWork, worksIn } from '@/data/works';
import CtaBand from '@/components/sections/CtaBand';
import PageTop from '@/components/sections/PageTop';
import Icon from '@/components/ui/Icon';
import { Line } from '@/components/ui/Typography';

const NUMBER_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'];

function ChapterCard({ collection, wide }) {
  const works = worksIn(collection.id);
  const lead = getWork(collection.lead);
  const available = works.filter((w) => w.status === 'available').length;
  const thumbs = works.filter((w) => w.id !== collection.lead).slice(0, 4);

  return (
    <Link
      to={`/collections/${collection.id}`}
      data-cursor="explore"
      className={cx('group flex flex-col text-primary no-underline hover:text-primary max-lg:col-span-1', wide ? 'col-span-3' : 'col-span-2')}
    >
      <div className="flex aspect-[4/3] min-h-0 items-center justify-center overflow-hidden rounded-ui bg-mat p-[22px] transition-colors duration-500 ease-gallery group-hover:bg-mat-hover">
        <img
          src={lead.img}
          alt={lead.alt}
          loading="lazy"
          className="block h-auto max-h-full w-auto max-w-full min-h-0 shadow-[0_2px_4px_rgba(34,33,31,.12),0_24px_36px_-18px_rgba(34,33,31,.5)] transition-transform duration-900 ease-gallery group-hover:-translate-y-1.5"
        />
      </div>
      {thumbs.length > 0 && (
        <div aria-hidden="true" className="mt-2 grid grid-cols-4 gap-2">
          {thumbs.map((t) => (
            <span key={t.id} className="aspect-square overflow-hidden rounded-ui bg-mat">
              <img src={t.img} alt="" loading="lazy" className="block size-full object-cover" />
            </span>
          ))}
        </div>
      )}
      <div className="mt-5 flex items-baseline gap-3.5">
        <span className="font-display text-[30px] leading-none text-secondary italic">{collection.num}</span>
        <span className="font-display text-[clamp(30px,2.6vw,40px)] leading-[1.05] font-normal">{collection.title}</span>
      </div>
      <div className="mt-2.5 flex gap-4 text-[13px]/5 text-muted">
        <span>
          {works.length} {works.length === 1 ? 'work' : 'works'}
        </span>
        <b className="font-semibold text-success">{available ? `${available} available` : 'None available now'}</b>
      </div>
      <p className="mt-3 mb-0 text-[15px]/6 text-soft">{collection.intro}</p>
      <span className="mt-4 inline-flex items-center gap-2 self-start border-b border-primary pb-1 text-sm font-semibold">
        Open chapter <Icon name="arrow" size={16} />
      </span>
    </Link>
  );
}

export default function CollectionsPage() {
  return (
    <>
      <PageTop labelledBy="cl-h" crumbs={[{ label: 'Collections' }]}>
        <div className="col-[1/8] max-lg:col-span-full">
          <p data-intro className="eyebrow m-0">
            Collections
          </p>
          <h1 id="cl-h" data-intro-line className="heading-1 mt-5 mb-0">
            <Line>{NUMBER_WORDS[COLLECTIONS.length] ?? COLLECTIONS.length} chapters of</Line>{' '}
            <Line>
              one <span className="text-secondary italic">practice.</span>
            </Line>
          </h1>
        </div>
        <p data-intro className="lead col-[9/13] m-0 max-lg:col-span-full max-lg:mt-6">
          Devotional figures, mandalas, portraits, walls and small joyful pieces. Open a chapter to see every work in it, available or not.
        </p>
      </PageTop>

      <section aria-label="All collections">
        <div className="wrap">
          <div data-stagger className="grid grid-cols-6 gap-x-7 gap-y-12 pt-10 pb-[clamp(96px,11vw,150px)] max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-14">
            {COLLECTIONS.map((c, i) => (
              <ChapterCard key={c.id} collection={c} wide={i < 2} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        id="cb-h"
        eyebrow="Every work, one place"
        title="See everything that’s available *now.*"
        lead="Browse the whole shop, or filter by the chapter you love most."
        to="/shop"
        label="Visit the Shop"
      />
    </>
  );
}
