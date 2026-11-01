import cx from '@/utils/cx';
import { getCollection, getWork } from '@/data/works';
import ArtLink from '@/components/art/ArtLink';
import StatusBadge from '@/components/ui/StatusBadge';
import TextLink from '@/components/ui/TextLink';
import { SplitWords } from '@/components/ui/Typography';
import { HOME_H2, LEDGER_WORKS } from '../homeContent';

const TH = 'border-b border-line pr-3 pb-3.5 text-left text-[11px]/4 font-semibold tracking-[.14em] text-muted uppercase';
const TD = 'border-b border-divider py-4 pr-3 align-middle max-sm:py-3.5 max-sm:pr-2.5';

/* 04 · The archive — a featured mural and the ledger of works that have found their walls */
export default function ArchivePreviewSection() {
  const feature = getWork('chalk');
  const ledger = LEDGER_WORKS.map(getWork);

  return (
    <section id="archive" data-chapter="04 · The archive" aria-labelledby="archive-h" className="pb-[clamp(96px,11vw,160px)]">
      <div className="wrap">
        <div className="grid-12 items-start">
          <div className="col-[1/6] max-lg:col-span-full">
            <p data-eyebrow className="eyebrow">
              04 · The archive
            </p>
            <SplitWords id="archive-h" text="The *uncollectable* collection." className={cx(HOME_H2, 'max-w-[12ch] font-normal')} />
            <p data-cap className="mt-6 max-w-[40ch] text-lg/[30px] text-soft">
              Some paintings have already found their walls. They stay here as part of the story, kept and numbered.
            </p>
            <figure className="mt-14">
              <ArtLink work={feature} aria-label={`View ${feature.title} mural, archive number ${feature.archiveNo}`} />
              <figcaption data-cap className="mt-[18px] flex items-baseline justify-between gap-4">
                <span className="flex flex-col gap-1">
                  <span className="eyebrow">Archive Nº {feature.archiveNo} · Murals</span>
                  <span className="font-display text-2xl/[30px] font-medium">{feature.title}</span>
                </span>
                <StatusBadge status={feature.status} leading="leading-[inherit]" />
              </figcaption>
            </figure>
          </div>

          <div className="col-[7/13] pt-2 max-lg:col-span-full max-lg:mt-16 max-sm:mt-14">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <caption className="pb-7 text-left font-display text-2xl/[30px] font-medium">From the ledger</caption>
                <thead>
                  <tr>
                    <th scope="col" className={TH}>Nº</th>
                    <th scope="col" className={TH}>Work</th>
                    <th scope="col" className={cx(TH, 'max-sm:hidden')}>Collection</th>
                    <th scope="col" className={cx(TH, 'max-sm:hidden')}>Year</th>
                    <th scope="col" className={TH}>Status</th>
                  </tr>
                </thead>
                <tbody data-stagger>
                  {ledger.map((work) => (
                    <tr key={work.id} className="group transition-colors duration-500 ease-gallery hover:bg-[#EFEAE2]">
                      <td className={cx(TD, 'text-xs font-semibold tracking-[.06em] text-muted tabular-nums')}>{work.archiveNo}</td>
                      <td className={TD}>
                        <a href="#archive" className="flex items-center gap-4 text-primary hover:text-link">
                          <img
                            src={work.img}
                            alt=""
                            width="44"
                            height="55"
                            loading="lazy"
                            className="block h-[55px] w-11 shrink-0 object-cover transition-transform duration-600 ease-gallery group-hover:scale-[1.14] group-hover:-rotate-3"
                          />
                          <span className="font-display text-xl/6 font-medium">{work.title}</span>
                        </a>
                      </td>
                      <td className={cx(TD, 'text-soft max-sm:hidden')}>{getCollection(work.collection).title}</td>
                      <td className={cx(TD, 'text-muted max-sm:hidden')}>[Year]</td>
                      <td className={TD}>
                        <StatusBadge status={work.status} leading="leading-[inherit]" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p data-cap className="mt-5 text-xs/[18px] text-muted">
              Archive numbers and years are working placeholders.
            </p>
            <div data-cap className="mt-10 flex flex-wrap items-center gap-8">
              <TextLink to="/archive" arrow>
                Enter the archive
              </TextLink>
              <span className="text-sm/[22px] text-soft">
                Love a sold piece?{' '}
                <a href="#commission" data-cursor="talk" className="font-semibold">
                  Commission something similar
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
