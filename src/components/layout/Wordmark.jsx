import cx from '@/utils/cx';
import SmartLink from '@/components/ui/SmartLink';

export default function Wordmark({ to = '/', inverse = false, label = 'KALA, home', className }) {
  return (
    <SmartLink
      to={to}
      aria-label={label}
      className={cx(
        'mr-[-.34em] font-display text-[26px] leading-none font-medium tracking-[.34em] no-underline',
        inverse ? 'text-paper' : 'text-ink hover:text-ink',
        className
      )}
    >
      KALA
    </SmartLink>
  );
}
