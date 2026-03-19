import { useEffect, useRef, useState } from 'react';
import { m } from 'framer-motion';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

type VideoFormat = 'portrait' | 'square' | 'landscape';

const VIDEO_SOURCES: Record<VideoFormat, string> = {
  portrait: '/videos/logo-portrait.mp4',
  square: '/videos/logo-square.mp4',
  landscape: '/videos/logo-landscape.mp4',
};

function getVideoFormat(): VideoFormat {
  const w = window.innerWidth;
  if (w < 640) return 'portrait';
  if (w < 1024) return 'square';
  return 'landscape';
}

/**
 * HomeSplash — Fullscreen animated logo intro overlay
 *
 * Plays the brand logo animation fullscreen with a matching yellow background.
 * Uses responsive video formats:
 *   - Mobile (<640px): portrait 9:16
 *   - Tablet (640–1023px): square 1:1
 *   - Desktop (≥1024px): landscape 16:9
 *
 * Stays fixed and immobile. The hero section scrolls OVER it (parallax cover).
 *
 * Reduced motion: skipped entirely (returns null).
 */
export default function HomeSplash() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [format, setFormat] = useState<VideoFormat>(() =>
    typeof window !== 'undefined' ? getVideoFormat() : 'landscape',
  );

  // Update video format on resize
  useEffect(() => {
    function handleResize() {
      setFormat(getVideoFormat());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Restart video when format changes
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.load();
      video.play().catch(() => {});
    }
  }, [format]);

  if (prefersReducedMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9]" aria-hidden="true">
      <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#FEEB09]">
        <m.video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          muted
          playsInline
          preload="auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <source src={VIDEO_SOURCES[format]} type="video/mp4" />
        </m.video>
      </div>
    </div>
  );
}
