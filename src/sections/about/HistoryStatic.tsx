import { STORY_BODY, STORY_BODY_2 } from './AboutHistory';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import ResponsiveImage from '@/components/common/ResponsiveImage';

export default function HistoryStatic() {
  return (
    <div>
      <div className="relative w-full">
        <SimpleAnimation type="fade" delay={0} immediate>
          <ResponsiveImage
            src="/images/about-history-shop-indoors.png"
            alt="Intérieur de La Lunetterie du Coin"
            className="max-h-[80vh] min-h-[50vh] w-full object-cover"
            widths={[640, 768, 1024]}
            sizes="100vw"
            width={1024}
            height={683}
          />
        </SimpleAnimation>

        <div className="absolute bottom-0 left-0 right-0 flex justify-center px-4 pb-8 sm:px-8 sm:pb-12">
          <SimpleAnimation type="slide-up" delay={200}>
            <div className="w-full max-w-4xl space-y-4 bg-accent/90 px-container-x py-container-y backdrop-blur-sm">
              <span className="text-body-sm font-medium uppercase tracking-wider text-black/40">
                Notre histoire
              </span>
              <h2 id="histoire-title" className="heading-section text-black">
                Un peu d&apos;histoire
              </h2>
              <p className="text-body-lg text-black/60">{STORY_BODY}</p>
              <p className="text-body text-black/40">{STORY_BODY_2}</p>
              <LinkCTA to="/services" theme="light" className="mt-4">
                Voir nos services
              </LinkCTA>
            </div>
          </SimpleAnimation>
        </div>
      </div>
    </div>
  );
}
