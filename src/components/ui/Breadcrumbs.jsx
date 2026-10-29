import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import cx from '@/utils/cx';

/* items: [{ label, to }] — the last item is the current page */
export default function Breadcrumbs({ items, inverse = false }) {
  const muted = inverse ? 'text-on-inverse-muted' : 'text-stone-ink';
  return (
    <ol data-intro aria-label="Breadcrumb" className={cx('m-0 flex list-none flex-wrap items-center gap-2 p-0 text-[13px]/5', muted)}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <Fragment key={item.label}>
            {i > 0 && <li aria-hidden="true">/</li>}
            {last ? (
              <li aria-current="page">{item.label}</li>
            ) : (
              <li>
                <Link to={item.to} className={cx('inline-flex min-h-8 items-center', muted, inverse ? 'hover:text-on-inverse-muted' : 'hover:text-ink')}>
                  {item.label}
                </Link>
              </li>
            )}
          </Fragment>
        );
      })}
    </ol>
  );
}
