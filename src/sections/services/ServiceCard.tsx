import { type ReactNode } from 'react';
import { m, useTransform, useSpring, type MotionValue } from 'framer-motion';

import { SERVICE_COUNT, SERVICES_START, SERVICES_END } from './constants';

import LinkCTA from '@/components/common/LinkCTA';
import { type ServiceData } from '@/data/services';
import { BOOKING_URL } from '@/config/endpoints';
import { useFadeInOut } from '@/hooks/useFadeInOut';
import { usePointerEvents } from '@/hooks/usePointerEvents';
import { SPRING_CONFIG } from '@/lib/motion';

function StaggerChild({
  children,
  scrollYProgress,
  enterStart,
  enterEnd,
  exitStart,
  exitEnd,
  staggerIndex,
}: {
  children: ReactNode;
  scrollYProgress: MotionValue<number>;
  enterStart: number;
  enterEnd: number;
  exitStart: number;
  exitEnd: number;
  staggerIndex: number;
}) {
  const STAGGER_OFFSET = 0.008;
  const offset = staggerIndex * STAGGER_OFFSET;

  const opacity = useFadeInOut(
    scrollYProgress,
    enterStart + offset,
    enterEnd + offset,
    exitStart - offset,
    exitEnd,
  );

  const yRaw = useTransform(scrollYProgress, [enterStart + offset, enterEnd + offset], [20, 0]);
  const y = useSpring(yRaw, SPRING_CONFIG);

  return (
    <m.div style={{ opacity, y }} className="will-change-transform">
      {children}
    </m.div>
  );
}

/**
 * Service text — editorial free-text style with staggered children.
 * Scrolls up alongside the photo stack.
 */
export function ServiceCard({
  service,
  index,
  scrollYProgress,
}: {
  service: ServiceData;
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const range = SERVICES_END - SERVICES_START;
  const segmentSize = range / SERVICE_COUNT;
  const start = SERVICES_START + index * segmentSize;

  const enterEnd = start + segmentSize * 0.2;
  const textScrollEnd = start + segmentSize * 0.75;
  const exitStart = start + segmentSize * 0.78;
  const end = start + segmentSize;

  const yRaw = useTransform(
    scrollYProgress,
    [start, enterEnd, textScrollEnd, exitStart, end],
    ['65vh', '18vh', '-18vh', '-18vh', '-65vh'],
  );
  const y = useSpring(yRaw, SPRING_CONFIG);

  const opacity = useFadeInOut(scrollYProgress, start, start + segmentSize * 0.08, exitStart, end);
  const pointerEvents = usePointerEvents(opacity);

  const isExamens = service.id === 'examens';

  const stEnter = start;
  const stEnterEnd = start + segmentSize * 0.12;
  const stExitStart = exitStart;
  const stExitEnd = end;

  return (
    <m.div
      className={`${index === 0 ? '' : 'absolute inset-0'} flex flex-col justify-center`}
      style={{ opacity, y, pointerEvents }}
    >
      <StaggerChild
        scrollYProgress={scrollYProgress}
        enterStart={stEnter}
        enterEnd={stEnterEnd}
        exitStart={stExitStart}
        exitEnd={stExitEnd}
        staggerIndex={0}
      >
        <span className="mb-4 block text-body-sm font-medium uppercase tracking-widest text-white">
          {String(index + 1).padStart(2, '0')} / {String(SERVICE_COUNT).padStart(2, '0')}
        </span>
      </StaggerChild>

      <StaggerChild
        scrollYProgress={scrollYProgress}
        enterStart={stEnter}
        enterEnd={stEnterEnd}
        exitStart={stExitStart}
        exitEnd={stExitEnd}
        staggerIndex={1}
      >
        <h3
          className="text-heading mb-5 text-accent"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 3.2rem)', lineHeight: '1.05' }}
        >
          {service.title}
        </h3>
      </StaggerChild>

      <StaggerChild
        scrollYProgress={scrollYProgress}
        enterStart={stEnter}
        enterEnd={stEnterEnd}
        exitStart={stExitStart}
        exitEnd={stExitEnd}
        staggerIndex={2}
      >
        <p className="mb-8 max-w-lg text-body-lg leading-relaxed text-white">
          {service.description}
        </p>
      </StaggerChild>

      <StaggerChild
        scrollYProgress={scrollYProgress}
        enterStart={stEnter}
        enterEnd={stEnterEnd}
        exitStart={stExitStart}
        exitEnd={stExitEnd}
        staggerIndex={3}
      >
        <ul className="mb-8 grid max-w-lg grid-cols-2 gap-x-6 gap-y-2.5">
          {service.details.slice(0, 6).map((detail, i) => (
            <li key={i} className="flex gap-2.5 text-body-sm text-white">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary-orange"
                aria-hidden="true"
              />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </StaggerChild>

      {isExamens && (
        <StaggerChild
          scrollYProgress={scrollYProgress}
          enterStart={stEnter}
          enterEnd={stEnterEnd}
          exitStart={stExitStart}
          exitEnd={stExitEnd}
          staggerIndex={4}
        >
          <div className="mb-8 max-w-lg border-l-2 border-accent/30 pl-5">
            <h4 className="mb-2 text-body-sm font-medium text-white">
              Conditions pour un examen en magasin
            </h4>
            <ul className="space-y-1 text-body-sm text-white">
              <li>
                Ordonnance {'<'} 5 ans (16-42 ans) ou {'<'} 3 ans (42+)
              </li>
              <li>Pas de mention contre-indiquant l&apos;examen hors cabinet</li>
              <li>Non autorisé : diabète, kératocône, glaucome, cataracte</li>
            </ul>
          </div>
        </StaggerChild>
      )}

      <StaggerChild
        scrollYProgress={scrollYProgress}
        enterStart={stEnter}
        enterEnd={stEnterEnd}
        exitStart={stExitStart}
        exitEnd={stExitEnd}
        staggerIndex={isExamens ? 5 : 4}
      >
        {isExamens ? (
          <LinkCTA
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            theme="dark"
            aria-label="Prendre rendez-vous pour un examen de vue"
          >
            Prendre rendez-vous
          </LinkCTA>
        ) : (
          <LinkCTA to="/contact" theme="dark" aria-label={`En savoir plus sur ${service.title}`}>
            Nous contacter
          </LinkCTA>
        )}
      </StaggerChild>
    </m.div>
  );
}
