import { Link } from 'react-router-dom';
import { SALE, saleEndsLabel } from '@/data/sale';
import { WORKS, onSale } from '@/data/works';
import Button from '@/components/ui/Button';
import { RingMandala } from '@/components/mandala/Mandala';
import SalePrice, { SaleTag } from '@/components/art/Price';

/* newest first, at most four in the banner */
const ON_SALE = WORKS.filter(onSale).reverse();

/* The launch-sale banner under the hero. Only while the sale runs (VITE_SALE_ON) and something is on sale. */
export default function SaleSection() {
  if (!ON_SALE.length) return null;
  const ends = saleEndsLabel();
  const shown = ON_SALE.slice(0, 4);
  const half = SALE.percent === 50;

  return (
    <section aria-labelledby="sale-h" className="relative z-2 -mt-[clamp(0px,4vw,56px)] pb-[clamp(96px,11vw,150px)] max-lg:mt-0">
      <div className="wrap">
        <div className="relative isolate overflow-hidden rounded-ui bg-primary px-[clamp(24px,5vw,72px)] py-[clamp(40px,6vw,80px)] text-on-primary">
          <RingMandala stroke="var(--color-sale-on-dark)" spin={260} className="absolute -top-[30%] -left-[18%] -z-1 w-[min(760px,120%)] opacity-25" />
          <div className="grid-12 items-center gap-y-12">
            <div className="col-[1/6] max-lg:col-span-full">
              <p data-eyebrow className="m-0 inline-flex flex-wrap items-center gap-2.5 text-[12px]/4 font-bold tracking-[.14em] text-sale-on-dark uppercase">
                <span aria-hidden="true">✦</span>
                {SALE.name}
                {ends && <span className="font-semibold text-on-primary-muted">· until {ends}</span>}
              </p>
              <h2 id="sale-h" data-cap className="mt-4 mb-0 font-display font-light tracking-[-.02em]">
                <span className="block text-[clamp(96px,13vw,180px)] leading-[.95]">
                  {SALE.percent}
                  <span className="ml-1 text-[.55em]">%</span>
                </span>
                <span className="mt-3 block text-[clamp(38px,4.4vw,60px)] leading-[1.05] text-sale-on-dark italic">off every original.</span>
              </h2>
              <p data-cap className="mt-7 mb-0 max-w-[40ch] text-[17px]/[28px] text-on-primary-soft">
                To celebrate the launch of KALA, every painting you can buy online is {half ? 'half price' : `${SALE.percent}% off`}. Each one is the only one
                there is, so the first to check out takes it home.
              </p>
              <div data-cap className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Button variant="light" to="/shop?available" arrow data-magnetic>
                  Shop the sale
                </Button>
                <span className="text-[13px]/5 text-on-primary-muted">Free shipping in India · Secure UPI, card or netbanking</span>
              </div>
            </div>

            <ul data-stagger aria-label="On sale now" className="col-[7/13] m-0 grid list-none grid-cols-2 gap-5 p-0 max-lg:col-span-full max-sm:gap-3.5">
              {shown.map((w, i) => (
                <li key={w.id} className={i % 2 ? 'translate-y-8 max-sm:translate-y-0' : undefined}>
                  <Link to={`/artwork/${w.id}`} data-cursor="view" aria-label={`View ${w.title}`} className="group block text-on-primary no-underline hover:text-on-primary">
                    <span className="relative flex aspect-[4/5] min-h-0 items-center justify-center overflow-hidden rounded-ui bg-primary-hover p-[clamp(14px,2vw,26px)]">
                      <SaleTag className="absolute top-3 left-3" />
                      <img
                        src={w.img}
                        alt={w.alt}
                        loading="lazy"
                        className="block h-auto max-h-full min-h-0 w-auto max-w-full shadow-[0_2px_4px_rgba(0,0,0,.2),0_26px_40px_-20px_rgba(0,0,0,.7)] transition-transform duration-900 ease-gallery group-hover:-translate-y-1.5 group-hover:-rotate-[1.5deg]"
                      />
                    </span>
                    <span className="mt-3 block font-display text-[clamp(18px,1.7vw,22px)]/[1.2] font-medium">{w.title}</span>
                    <SalePrice work={w} size="sm" badge={false} dark className="mt-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
