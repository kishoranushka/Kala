import { useEffect, useRef, useState } from 'react';
import cx from '@/utils/cx';
import { prefersReducedMotion } from '@/motion/gsap';
import Icon from '@/components/ui/Icon';

/* A silent motion study: muted, inline, plays only while on screen.
   A viewer's pause is respected; reduced motion never autoplays. */
export default function Film({ src, poster, label, portrait = false, tag = false, className }) {
  const videoRef = useRef(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    let observer;
    if (!prefersReducedMotion() && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            if (!userPaused.current) video.play().catch(() => {});
          } else if (!video.paused) {
            video.pause();
          }
        },
        { threshold: [0, 0.35, 0.7] }
      );
      observer.observe(video);
    }
    return () => {
      observer?.disconnect();
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.pause();
    };
  }, [src]);

  const toggle = () => {
    const video = videoRef.current;
    userPaused.current = !video.paused;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <div className={cx('relative overflow-hidden rounded-ui bg-film', portrait ? 'aspect-[9/16]' : 'aspect-video', className)}>
      <video ref={videoRef} src={src} poster={poster} muted loop playsInline preload="metadata" aria-label={label} className="block size-full object-cover" />
      {tag && (
        <span className="absolute top-4 right-4 z-[2] rounded-ui bg-[rgba(27,26,24,.55)] px-2.5 py-1.5 font-sans text-[10px]/[14px] font-semibold tracking-[.14em] text-[#E9E3D9] uppercase max-sm:top-3 max-sm:right-3">
          Silent
        </span>
      )}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={`${playing ? 'Pause' : 'Play'} film`}
        className="absolute bottom-4 left-4 z-[2] inline-flex h-10 cursor-pointer items-center gap-2.5 rounded-ui border-0 bg-[rgba(27,26,24,.62)] pr-3.5 pl-2.5 font-sans text-xs font-semibold tracking-[.08em] text-on-primary uppercase backdrop-blur-[8px] transition-colors duration-400 ease-gallery hover:bg-[rgba(27,26,24,.85)] focus-visible:outline-on-primary focus-visible:outline-offset-2 max-sm:bottom-3 max-sm:left-3"
      >
        <Icon name={playing ? 'pause' : 'play'} size={14} />
        {playing ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}

/* caption under a film: a bold lead-in on the left, a note on the right */
export function FilmCaption({ children, note }) {
  return (
    <figcaption className="mt-3.5 flex justify-between gap-4 text-[13px]/5 text-muted in-[.inverse]:text-on-primary-muted [&_b]:font-semibold [&_b]:text-primary in-[.inverse]:[&_b]:text-on-primary">
      <span>{children}</span>
      {note && <span>{note}</span>}
    </figcaption>
  );
}
