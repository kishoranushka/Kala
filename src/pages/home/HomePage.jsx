import { usePageMotion } from '@/motion/MotionContext';
import { homeMotion } from './homeMotion';
import HeroSection from './sections/HeroSection';
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
