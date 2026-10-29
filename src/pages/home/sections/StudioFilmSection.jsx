import cx from '@/utils/cx';
import { FILMS } from '@/data/works';
import Film, { FilmCaption } from '@/components/art/Film';
import InverseSection from '@/components/sections/InverseSection';
import { SplitWords } from '@/components/ui/Typography';
import { HOME_H2 } from '../homeContent';

/* In the studio — a twenty-second motion study */
export default function StudioFilmSection() {
  return (
    <InverseSection aria-labelledby="film-h" className="py-[120px] max-lg:py-[88px] max-sm:py-[72px]">
      <div className="wrap">
        <div className="mb-12 grid grid-cols-12 items-end gap-6 max-sm:mb-8">
          <div className="col-[1/8] max-lg:col-span-full">
            <p data-eyebrow className="eyebrow">
              In the studio · 20 seconds
            </p>
            <SplitWords id="film-h" text="Closer than a photograph lets *you* *look*." className={cx(HOME_H2, 'max-w-[16ch] font-light')} />
          </div>
          <p data-cap className="col-[9/13] text-[#D9D3C8] max-lg:col-span-full">
            The camera drifts over paint pots, dot rings and brushwork, then steps back to show each painting whole.
          </p>
        </div>
        <figure data-reveal data-noinner className="m-0">
          <Film
            {...FILMS.studio}
            tag
            label="A silent 20-second film moving across the studio table and six paintings: Vitthal, Om Mandala, Krishna and Radha, The Escape Key, the mural and Ganesha"
          />
          <FilmCaption note="[Swap in real studio footage when you have it.]">
            <b>Motion study</b> made from photographs of the paintings.
          </FilmCaption>
        </figure>
      </div>
    </InverseSection>
  );
}
