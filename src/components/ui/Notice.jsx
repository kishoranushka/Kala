import cx from '@/utils/cx';
import Icon from './Icon';

const TONES = {
  ok: { bg: 'bg-success-wash', icon: 'check', color: 'text-success' },
  warn: { bg: 'bg-warning-wash', icon: 'alert', color: 'text-warning' },
  error: { bg: 'bg-error-wash', icon: 'alert', color: 'text-error' },
  info: { bg: 'bg-link-wash', icon: 'lock', color: 'text-link' },
};

export default function Notice({ tone = 'info', className, children, ...props }) {
  const t = TONES[tone];
  return (
    <div className={cx('flex items-start gap-3 rounded-[2px] px-[18px] py-4 text-sm/[22px] text-primary', t.bg, className)} {...props}>
      <Icon name={t.icon} size={20} strokeWidth={1.75} className={cx('shrink-0', t.color)} />
      <span>{children}</span>
    </div>
  );
}
