import { StoryDesktopAnimated } from './story/StoryDesktopAnimated';
import { StoryDesktopStatic } from './story/StoryDesktopStatic';
import { StoryMobileAnimated } from './story/StoryMobileAnimated';
import { StoryMobileStatic } from './story/StoryMobileStatic';

import { useResponsiveMotion } from '@/hooks/useResponsiveMotion';

/**
 * Section HomeStory — 3-column editorial with scroll-driven parallax
 *
 * Desktop: scroll-driven parallax with photo expanding fullscreen at end.
 * Mobile: scroll-driven text-first layout with word reveal and decorative photo.
 * Reduced motion: static layouts, no scroll hooks mounted.
 */
function HomeStory() {
  const variant = useResponsiveMotion();

  return (
    <section
      id="story"
      className="relative -mt-[8vw] w-full bg-black pt-[36vw] [overflow-x:clip] lg:-mt-0 lg:pt-[35vh]"
      aria-labelledby="story-title"
      data-navbar-theme="light"
    >
      {/* Convex eyelid dome — top half of ellipse only, flat bottom edge */}
      <div
        className="pointer-events-none absolute -top-[11vw] left-1/2 z-20 h-[22.5vw] w-[140vw] -translate-x-1/2 bg-black"
        aria-hidden="true"
        data-navbar-theme="light"
        style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }}
      />

      {variant === 'desktop-animated' && <StoryDesktopAnimated />}
      {variant === 'mobile-animated' && <StoryMobileAnimated />}
      {variant === 'static' && (
        <>
          <StoryDesktopStatic />
          <StoryMobileStatic />
        </>
      )}
    </section>
  );
}

export default HomeStory;
