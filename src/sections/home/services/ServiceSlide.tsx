import { m, useTransform, type MotionValue } from 'framer-motion';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';

import { GrainOverlay } from './GrainOverlay';
import { SERVICE_COUNT } from './constants';
import { SERVICES_START, SERVICE_RANGE } from './ServicesMobileAnimated.timeline';

import ResponsiveImage from '@/components/common/ResponsiveImage';
import LinkCTA from '@/components/common/LinkCTA';
import { HOMEPAGE_SERVICES } from '@/data/homepage';
import { BOOKING_URL } from '@/config/endpoints';

function getServiceRange(index: number) {
  const start = SERVICES_START + index * SERVICE_RANGE;
  const end = start + SERVICE_RANGE;
  return { start, end };
}

export function ServiceSlide({
  service,
  index,
  scrollYProgress,
}: {
  service: (typeof HOMEPAGE_SERVICES)[number];
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const { start, end } = getServiceRange(index);
  const mid = start + (end - start) * 0.5;

  // Photo: crossfade in/out + subtle zoom (last slide stays visible for outro transition)
  const isLast = index === SERVICE_COUNT - 1;
  const photoOpacity = useTransform(
    scrollYProgress,
    index === 0
      ? [start, start + 0.04, mid + 0.02, end]
      : isLast
        ? [start - 0.02, start + 0.04, mid + 0.02, 1]
        : [start - 0.02, start + 0.04, mid + 0.02, end],
    index === 0 ? [1, 1, 1, 0] : isLast ? [0, 1, 1, 1] : [0, 1, 1, 0],
  );
  const photoScale = useTransform(scrollYProgress, [start, end], [1.08, 1.0]);

  // Text staggered entrance
  const textIn = start + 0.03;
  const titleOpacity = useTransform(scrollYProgress, [textIn, textIn + 0.04], [0, 1]);
  const titleY = useTransform(scrollYProgress, [textIn, textIn + 0.04], [24, 0]);
  const descOpacity = useTransform(scrollYProgress, [textIn + 0.02, textIn + 0.06], [0, 1]);
  const descY = useTransform(scrollYProgress, [textIn + 0.02, textIn + 0.06], [18, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [textIn + 0.04, textIn + 0.08], [0, 1]);

  // Text exit (before next slide)
  const exitStart = mid + 0.02;
  const textExitOpacity = useTransform(scrollYProgress, [exitStart, exitStart + 0.03], [1, 0]);

  // Combined text opacities
  const combinedTitle = useTransform(
    [titleOpacity, textExitOpacity] as MotionValue<number>[],
    ([inV, outV]: number[]) => Math.min(inV, outV),
  );
  const combinedDesc = useTransform(
    [descOpacity, textExitOpacity] as MotionValue<number>[],
    ([inV, outV]: number[]) => Math.min(inV, outV),
  );
  const combinedCta = useTransform(
    [ctaOpacity, textExitOpacity] as MotionValue<number>[],
    ([inV, outV]: number[]) => Math.min(inV, outV),
  );

  return (
    <>
      {/* Background photo */}
      <m.div
        className="absolute inset-0 will-change-[opacity,transform]"
        style={{ opacity: photoOpacity, zIndex: index }}
      >
        <m.div className="h-full w-full will-change-transform" style={{ scale: photoScale }}>
          <ResponsiveImage
            src={service.image}
            alt=""
            className="h-full w-full object-cover"
            loading={index === 0 ? 'eager' : 'lazy'}
            sizes="100vw"
            widths={[640, 768, 1024]}
          />
        </m.div>
        <GrainOverlay />
      </m.div>

      {/* Text content — positioned in lower-middle area */}
      <m.div
        className="absolute inset-x-0 bottom-[15%] z-20 px-container-x"
        style={{ opacity: combinedTitle }}
        aria-hidden={index > 0 ? true : undefined}
      >
        <div className="max-w-md sm:max-w-xl md:max-w-2xl">
          <m.h3
            className="text-subtitle text-title-sm text-white"
            style={{ opacity: combinedTitle, y: titleY }}
          >
            {service.title}
          </m.h3>
          <m.p
            className="mt-3 text-body text-white/85 md:text-body-lg"
            style={{ opacity: combinedDesc, y: descY }}
          >
            {service.description}
          </m.p>
          <m.div
            className="mt-4 flex flex-wrap items-center gap-4"
            style={{ opacity: combinedCta }}
          >
            <LinkCTA
              to={service.link}
              theme="dark"
              aria-label={`En savoir plus sur ${service.title}`}
            >
              En savoir plus
            </LinkCTA>
            {service.title === 'Examens de vue' && (
              <LinkCTA
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                theme="dark"
                icon={ExternalLink}
                aria-label="Prendre rendez-vous pour un examen de vue"
              >
                Prendre RDV
              </LinkCTA>
            )}
          </m.div>
        </div>
      </m.div>
    </>
  );
}
