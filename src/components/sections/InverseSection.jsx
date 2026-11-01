import cx from '@/utils/cx';

/* a dark chapter: ink ground, paper text; links, eyebrows and focus rings switch to their inverse forms */
export default function InverseSection({ className, children, ...props }) {
  return (
    <section className={cx('inverse relative overflow-hidden bg-primary text-on-primary', className)} {...props}>
      {children}
    </section>
  );
}
