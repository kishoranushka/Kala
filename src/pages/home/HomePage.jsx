import { usePageMotion } from '@/motion/MotionContext';
import { homeMotion } from './homeMotion';
import HeroSection from './sections/HeroSection';
import Marquee from './sections/Marquee';
import AtlasSection from './sections/AtlasSection';
import PatternSection from './sections/PatternSection';
import HandSection from './sections/HandSection';
import StudioFilmSection from './sections/StudioFilmSection';
import QuietSection from './sections/QuietSection';
import ArchivePreviewSection from './sections/ArchivePreviewSection';
import CommissionInviteSection from './sections/CommissionInviteSection';

export default function HomePage() {
  usePageMotion(homeMotion);

  return (
    <>
      <HeroSection />
      <Marquee />
      <AtlasSection />
      <PatternSection />
      <HandSection />
      <StudioFilmSection />
      <QuietSection />
      <ArchivePreviewSection />
      <CommissionInviteSection />
    </>
  );
}
