import { usePageMotion } from '@/motion/MotionContext';
import { homeMotion } from './homeMotion';
import { saleActive } from '@/data/sale';
import HeroSection from './sections/HeroSection';
import SaleSection from './sections/SaleSection';
import PathsSection from './sections/PathsSection';
import ShopStripSection from './sections/ShopStripSection';
import WallsSection from './sections/WallsSection';
import WearablesSection from './sections/WearablesSection';
import ReelsSection from './sections/ReelsSection';
import MeetSection from './sections/MeetSection';
import BandSection from './sections/BandSection';

export default function HomePage() {
  usePageMotion(homeMotion);

  return (
    <>
      <HeroSection />
      {saleActive() && <SaleSection />}
      <PathsSection />
      <ShopStripSection />
      <WallsSection />
      <WearablesSection />
      <ReelsSection />
      <MeetSection />
      <BandSection />
    </>
  );
}
