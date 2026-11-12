import Disclosure from '@/components/ui/Disclosure';
import { SplitWords } from '@/components/ui/Typography';

/* questions & answers (data in src/data/faq.js — the same text goes into the page's FAQPage schema).
   Same look as the original "Before you write" block on the Contact page. */
export default function FaqSection({ id, eyebrow, title, items, className = 'pb-[clamp(96px,11vw,160px)]' }) {
  return (
    <section aria-labelledby={id} className={className}>
      <div className="wrap">
        <div className="grid-12">
          <div className="col-[3/11] max-lg:col-span-full">
            <p data-eyebrow className="eyebrow">
              {eyebrow}
            </p>
            <SplitWords id={id} text={title} className="heading-2 mt-5 font-light" />
            <div data-cap className="mt-10">
              {items.map((item) => (
                <Disclosure key={item.q} title={item.q}>
                  {item.a}
                </Disclosure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
