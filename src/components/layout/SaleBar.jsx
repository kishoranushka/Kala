import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SALE, saleActive, saleEndsLabel } from '@/data/sale';
import { WORKS, onSale } from '@/data/works';
import Icon from '@/components/ui/Icon';

/* The thin announcement strip above the header on every page while the sale runs (VITE_SALE_ON).
   It stays pinned to the top (sticky, with the header, in SiteLayout) and publishes its height as
   --sale-h, so other sticky bars (shop filters, side panels) sit below it.
   Renders nothing when the sale is off or nothing is on sale. */
export default function SaleBar() {
  const show = saleActive() && WORKS.some(onSale);
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const html = document.documentElement;
    const set = () => html.style.setProperty('--sale-h', `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => {
      ro.disconnect();
      html.style.removeProperty('--sale-h');
    };
  }, [show]);

  if (!show) return null;
  const ends = saleEndsLabel();
  return (
    <Link
      ref={ref}
      to="/shop?available"
      data-sale-bar
      className="group relative z-51 block bg-sale text-on-primary no-underline hover:text-on-primary"
    >
      <span className="wrap flex min-h-10 items-center justify-center gap-x-3 py-2 text-center text-[13px]/[18px] font-semibold tracking-[.02em] max-sm:text-[12px]/4">
        <span aria-hidden="true" className="text-[15px] leading-none">✦</span>
        <span>
          <b className="font-bold tracking-[.08em] uppercase">{SALE.name}</b>
          <span className="mx-2 opacity-70">·</span>
          {SALE.percent}% off every available original
          {ends && <span className="max-sm:hidden"> · until {ends}</span>}
        </span>
        <span className="inline-flex items-center gap-1.5 border-b border-current max-xs:hidden">
          Shop now
          <Icon name="arrow" size={15} strokeWidth={2} className="transition-transform duration-500 ease-gallery group-hover:translate-x-1" />
        </span>
      </span>
    </Link>
  );
}
