import { useEffect, useRef, useState } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';

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
 * Video fades out as the user starts scrolling, revealing the yellow background
 * underneath for a seamless transition to the hero section.
 *
 * Uses responsive video formats:
 *   - Mobile (<640px): portrait 9:16
 *   - Tablet (640–1023px): square 1:1
 *   - Desktop (≥1024px): landscape 16:9
 *
 * Reduced motion: skipped entirely (returns null).
 */
export default function HomeSplash() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [format, setFormat] = useState<VideoFormat>(() =>
    typeof window !== 'undefined' ? getVideoFormat() : 'landscape',
  );

  const { scrollY } = useScroll();
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

  // Video fades out as user scrolls — synced with hero clipPath reveal
  const videoOpacity = useTransform(scrollY, [vh * 0.15, vh * 0.55], [1, 0]);

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
          className="h-full w-full object-contain"
          autoPlay
          muted
          playsInline
          preload="auto"
          style={{ opacity: videoOpacity }}
        >
          <source src={VIDEO_SOURCES[format]} type="video/mp4" />
        </m.video>
      </div>
    </div>
  );
}
