import { useCallback, useEffect, useRef, useState } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';

/** Typographic info accent — keyword in display font with colored underline */
export function InfoAccent({
  color,
  keyword,
  detail,
}: {
  color: 'green' | 'orange';
  keyword: string;
  detail: string;
}) {
  const barColor = color === 'green' ? 'bg-secondary-green' : 'bg-secondary-orange';
  return (
    <div className="flex flex-col gap-1">
      <span className="font-display text-title-sm uppercase leading-none text-black">
        {keyword}
      </span>
      <div className={`h-[3px] w-8 ${barColor}`} />
      <span className="text-body-sm text-black/70">{detail}</span>
    </div>
  );
}

const HERO_WORDS = [
  { text: 'POUR', fillWidth: true },
  { text: "L'AMOUR", fillWidth: true },
  { text: 'DES', fillWidth: false },
  { text: 'YEUX', fillWidth: true },
];

const BASE_FONT_SIZE = 100;

function useFitFontSize(fillWidth: boolean) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState<number>(0);

  const measure = useCallback(() => {
    const el = measureRef.current;
    if (!el) return;
    const targetWidth = fillWidth ? window.innerWidth : window.innerWidth * 0.4;
    const naturalWidth = el.offsetWidth;
    if (naturalWidth > 0) {
      setFontSize((targetWidth / naturalWidth) * BASE_FONT_SIZE);
    }
  }, [fillWidth]);

  useEffect(() => {
    if (document.fonts?.ready) {
      document.fonts.ready.then(measure);
    } else {
      requestAnimationFrame(() => requestAnimationFrame(measure));
    }
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  return { measureRef, fontSize };
}

function FitWord({
  word,
  index,
  scrollY,
  revealStart,
}: {
  word: (typeof HERO_WORDS)[number];
  index: number;
  scrollY: ReturnType<typeof useScroll>['scrollY'];
  revealStart: number;
}) {
  const { measureRef, fontSize } = useFitFontSize(word.fillWidth);

  const wordStart = revealStart + index * 60;
  const wordEnd = wordStart + 150;
  const y = useTransform(scrollY, [wordStart, wordEnd], ['110%', '0%']);
  const opacity = useTransform(scrollY, [wordStart, wordEnd], [0, 1]);

  return (
    <div className="relative w-full">
      <span
        ref={measureRef}
        className="pointer-events-none absolute left-0 top-0 whitespace-nowrap font-display font-black uppercase opacity-0"
        style={{ fontSize: BASE_FONT_SIZE }}
        aria-hidden="true"
      >
        {word.text}
      </span>

      <div className="overflow-hidden">
        <m.span className="block" style={{ y, opacity }}>
          <span
            className="block whitespace-nowrap font-display font-black uppercase leading-[0.82] text-black"
            style={{ fontSize: fontSize || undefined }}
            aria-hidden="true"
          >
            {word.text}
          </span>
        </m.span>
      </div>
    </div>
  );
}

function HeroMobileAccents({
  scrollY,
  revealStart,
}: {
  scrollY: ReturnType<typeof useScroll>['scrollY'];
  revealStart: number;
}) {
  const accentsStart = revealStart + HERO_WORDS.length * 60 + 250;

  const accent1Y = useTransform(scrollY, [accentsStart, accentsStart + 180], [40, 0]);
  const accent1Opacity = useTransform(scrollY, [accentsStart, accentsStart + 180], [0, 1]);
  const accent2Y = useTransform(scrollY, [accentsStart + 140, accentsStart + 320], [40, 0]);
  const accent2Opacity = useTransform(scrollY, [accentsStart + 140, accentsStart + 320], [0, 1]);

  return (
    <div className="mx-auto flex flex-1 flex-col items-start justify-center gap-4 lg:hidden">
      <m.div style={{ y: accent1Y, opacity: accent1Opacity }}>
        <InfoAccent color="green" keyword="Strasbourg" detail="Opticien depuis 2016." />
      </m.div>
      <m.div style={{ y: accent2Y, opacity: accent2Opacity }}>
        <InfoAccent color="orange" keyword="Neuf & Occasion" detail="Du neuf, du vécu, du style." />
      </m.div>
    </div>
  );
}

export function HeroMobileContent({ titleId }: { titleId?: string }) {
  const { scrollY } = useScroll();
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const revealStart = vh * 1.4;

  return (
    <>
      <div className="absolute inset-x-0 bottom-[calc(11vw+0.75rem)] top-0 z-10 -mt-[0.1em] flex flex-col lg:hidden">
        <h1 id={titleId} className="sr-only">
          POUR L&apos;AMOUR DES YEUX
        </h1>
        {HERO_WORDS.map((word, i) => (
          <FitWord
            key={word.text}
            word={word}
            index={i}
            scrollY={scrollY}
            revealStart={revealStart}
          />
        ))}

        <HeroMobileAccents scrollY={scrollY} revealStart={revealStart} />
      </div>
    </>
  );
}
