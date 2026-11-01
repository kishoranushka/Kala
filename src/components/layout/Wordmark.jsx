import cx from '@/utils/cx';
import { CONTACT } from '@/data/site';
import SmartLink from '@/components/ui/SmartLink';

/* KALA in spaced display capitals; the header adds the artist's name beside it */
export default function Wordmark({ to = '/', inverse = false, withName = false, label = `KALA by ${CONTACT.artist}, home`, className, ...props }) {
  return (
    <SmartLink
      to={to}
      aria-label={label}
      className={cx(
        'inline-flex items-baseline font-display text-[26px] leading-none font-medium tracking-[.34em] no-underline',
        !withName && 'mr-[-.34em]',
        inverse ? 'text-on-primary hover:text-on-primary' : 'text-primary hover:text-primary',
        className
      )}
      {...props}
    >
      KALA
      {withName && (
        <span className="ml-[calc(.34em+12px)] font-sans text-xs leading-none font-medium tracking-[.04em] whitespace-nowrap text-muted max-xs:hidden">
          by {CONTACT.artist}
        </span>
      )}
    </SmartLink>
  );
}
