import cx from '@/utils/cx';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

/* the opening band of an inner page: an optional turning mandala, breadcrumbs, then the page's own intro */
export default function PageIntro({ crumbs, mandala, labelledBy, paddingBottom = 'pb-[clamp(56px,7vw,104px)]', bodyClassName = 'mt-8', children }) {
  return (
    <section aria-labelledby={labelledBy} className={cx('relative overflow-hidden pt-[clamp(40px,6vw,88px)]', paddingBottom)}>
      {mandala}
      <div className="wrap relative">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, ...crumbs]} />
        <div className={cx('grid-12', bodyClassName)}>{children}</div>
      </div>
    </section>
  );
}
