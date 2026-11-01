import { getWork } from '@/data/works';
import ShopCard from '@/components/art/ShopCard';
import SectionHead, { ArrowLink } from '@/components/sections/SectionHead';

const SHOP = ['buddha', 'cat', 'sunflower', 'butterfly', 'elephant', 'peacock', 'ganesha', 'radhakrishna'];

export default function ShopStripSection() {
  return (
    <section aria-labelledby="shop-h" className="pb-[clamp(96px,11vw,150px)]">
      <div className="wrap">
        <SectionHead
          id="shop-h"
          eyebrow="The shop"
          title="Looking for a *home.*"
          aside={
            <ArrowLink to="/shop" data-cap>
              See all paintings
            </ArrowLink>
          }
        />
        <div data-stagger className="grid grid-cols-4 gap-7 max-xl:grid-cols-2 max-sm:gap-x-4">
          {SHOP.map((id) => (
            <ShopCard key={id} work={getWork(id)} />
          ))}
        </div>
      </div>
    </section>
  );
}
