import { useEffect, useRef, useState } from 'react';
import { m, useScroll, useSpring, useTransform } from 'framer-motion';

import LogoNO from '@/assets/logo/Logo_LLDC_NO_Noir.svg?react';
import ResponsiveImage from '@/components/common/ResponsiveImage';
import { useIsLg } from '@/hooks/useIsLg';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { SPRING_CONFIG } from '@/lib/motion';

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
 * Desktop: Plays the brand logo animation centred with yellow background.
 * Mobile/Tablet: Entirely scroll-driven — logo starts centred & huge, lifts to
 * top half as user scrolls, photos reveal from the bottom and travel all the way
 * up before fading out. Scrolling back up reverses everything smoothly.
 *
 * Reduced motion: skipped entirely (returns null).
 */
export default function HomeSplash() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLg = useIsLg();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [format, setFormat] = useState<VideoFormat>(() =>
    typeof window !== 'undefined' ? getVideoFormat() : 'landscape',
  );
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);

  const { scrollY } = useScroll();
  const [vh, setVh] = useState(() => (typeof window !== 'undefined' ? window.innerHeight : 800));

  useEffect(() => {
    const handleVhChange = () => setVh(window.innerHeight);
    window.addEventListener('resize', handleVhChange);
    return () => window.removeEventListener('resize', handleVhChange);
  }, []);

  // ── Desktop: video fades out on scroll ──
  const videoOpacity = useTransform(scrollY, [vh * 0.08, vh * 0.3], [1, 0]);

  // ── Mobile: logo — centred → lifts to top half ──
  // Height: 100% → 55% (logo area shrinks to top half)
  const logoHeightRaw = useTransform(scrollY, [0, vh * 0.25], ['100%', '55%']);
  const logoHeight = useSpring(logoHeightRaw, SPRING_CONFIG);
  // Scale: starts smaller, grows as it lifts to compensate height shrink
  const logoScaleRaw = useTransform(scrollY, [0, vh * 0.25], [1, 1.6]);
  const logoScale = useSpring(logoScaleRaw, SPRING_CONFIG);
  // Logo fades out later as photos pass over it
  const mobileLogoOpacity = useTransform(scrollY, [vh * 0.4, vh * 0.7], [1, 0]);

  // ── Mobile: photos — scroll-driven entrance + parallax to top ──
  // Photos appear after logo starts lifting
  const photoOpacityRaw = useTransform(scrollY, [vh * 0.1, vh * 0.3], [0, 1]);
  const photoOpacity = useSpring(photoOpacityRaw, SPRING_CONFIG);

  // Photos travel from bottom to top of page
  const photoLeftYRaw = useTransform(scrollY, [vh * 0.1, vh * 1.2], ['20%', '-180%']);
  const photoRightYRaw = useTransform(scrollY, [vh * 0.1, vh * 1.2], ['30%', '-150%']);
  const photoLeftY = useSpring(photoLeftYRaw, SPRING_CONFIG);
  const photoRightY = useSpring(photoRightYRaw, SPRING_CONFIG);

  // Scale landing — start slightly zoomed, settle to 1
  const photoLeftScaleRaw = useTransform(scrollY, [vh * 0.1, vh * 0.35], [1.08, 1]);
  const photoRightScaleRaw = useTransform(scrollY, [vh * 0.15, vh * 0.4], [1.08, 1]);
  const photoLeftScale = useSpring(photoLeftScaleRaw, SPRING_CONFIG);
  const photoRightScale = useSpring(photoRightScaleRaw, SPRING_CONFIG);

  // Ken Burns — subtle internal parallax on the images
  const kenBurnsLeftScale = useTransform(scrollY, [0, vh * 0.8], [1.15, 1]);
  const kenBurnsRightScale = useTransform(scrollY, [0, vh * 0.8], [1, 1.15]);

  // Pause video once fully faded out to free resources (but keep yellow bg)
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (v) => {
      const video = videoRef.current;
      if (!video) return;

      if (v > vh * 0.45 && !videoPaused) {
        video.pause();
        setVideoPaused(true);
      } else if (v < vh * 0.1 && videoPaused) {
        video.play().catch(() => {});
        setVideoPaused(false);
      }
    });
    return unsubscribe;
  }, [scrollY, vh, videoPaused]);

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
      <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-accent">
        {/* ── Desktop layout: centred video ── */}
        {isLg && (
          <>
            {!videoFailed && (
              <m.video
                ref={videoRef}
                className="h-[55%] w-[55%] object-contain"
                autoPlay
                muted
                playsInline
                preload="auto"
                initial={{ scale: 1 }}
                animate={{ scale: 1.2 }}
                transition={{ duration: 10, ease: 'easeInOut' }}
                style={{ opacity: videoOpacity }}
                onError={() => setVideoFailed(true)}
              >
                <source src={VIDEO_SOURCES[format]} type="video/mp4" />
              </m.video>
            )}
            {videoFailed && <LogoNO className="h-auto w-[50%] max-w-sm" />}
          </>
        )}

        {/* ── Mobile/Tablet layout — fully scroll-driven ── */}
        {!isLg && (
          <>
            {/* Logo video — centred at scroll 0, lifts to top half on scroll */}
            <m.div
              className="absolute inset-x-0 top-0 z-10 flex items-center justify-center"
              style={{ height: logoHeight, opacity: mobileLogoOpacity }}
            >
              {!videoFailed && (
                <m.video
                  ref={videoRef}
                  className="h-full w-[100vw] object-contain sm:w-[80vw]"
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  style={{ scale: logoScale }}
                  onError={() => setVideoFailed(true)}
                >
                  <source src={VIDEO_SOURCES[format]} type="video/mp4" />
                </m.video>
              )}
              {videoFailed && <LogoNO className="h-auto w-[70%] max-w-xs" />}
            </m.div>

            {/* Photos — scroll reveals, travel to top, Ken Burns internal */}
            <m.div
              className="absolute -bottom-[5%] left-0 z-20 h-[38%] w-[54%] overflow-hidden"
              style={{
                y: photoLeftY,
                opacity: photoOpacity,
                scale: photoLeftScale,
              }}
            >
              <m.div className="h-full w-full" style={{ scale: kenBurnsLeftScale }}>
                <ResponsiveImage
                  src="/images/hero-eyeglasses-left.jpg"
                  alt="Lunettes élégantes"
                  className="h-full w-full object-cover"
                  loading="eager"
                  sizes="54vw"
                  widths={[384, 640]}
                />
              </m.div>
            </m.div>

            <m.div
              className="absolute -bottom-[12%] right-0 z-20 h-[38%] w-[54%] overflow-hidden"
              style={{
                y: photoRightY,
                opacity: photoOpacity,
                scale: photoRightScale,
              }}
            >
              <m.div className="h-full w-full" style={{ scale: kenBurnsRightScale }}>
                <ResponsiveImage
                  src="/images/hero-eyeglasses-right.jpg"
                  alt="Collection de montures"
                  className="h-full w-full object-cover"
                  loading="eager"
                  sizes="54vw"
                  widths={[384, 640]}
                />
              </m.div>
            </m.div>
          </>
        )}
      </div>
    </div>
  );
}
