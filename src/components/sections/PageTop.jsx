import cx from '@/utils/cx';
import { PageMandala } from '@/components/mandala/Mandala';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

/* The opening of an inner page: the turning line mandala in the top-right corner,
   breadcrumbs, then the page's own intro. `crumbs` excludes Home. */
export default function PageTop({ labelledBy, crumbs, mandala = true, className, bodyClassName = 'mt-7 grid-12 items-end', children }) {
  return (
    <section aria-labelledby={labelledBy} className={cx('relative overflow-hidden pt-[clamp(40px,6vw,88px)] pb-[clamp(56px,7vw,104px)]', className)}>
      {mandala && <PageMandala className="-top-[260px] -right-[240px] w-[760px] opacity-85 max-sm:-top-[240px] max-sm:-right-[260px] max-sm:w-[520px]" />}
      <div className="wrap relative z-1">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, ...crumbs]} />
        <div className={bodyClassName}>{children}</div>
      </div>
    </section>
  );
}
