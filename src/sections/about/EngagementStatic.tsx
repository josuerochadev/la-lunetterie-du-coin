import { ENGAGEMENT_TITLE, ENGAGEMENT_BODY, ENGAGEMENT_HIGHLIGHT } from './AboutEngagement';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import { STATS_DATA } from '@/data/about';

export default function EngagementStatic() {
  return (
    <div className="mx-auto max-w-container px-container-x py-section">
      <div className="mx-auto max-w-4xl">
        <SimpleAnimation type="slide-up" delay={0}>
          <div className="mb-8 text-center">
            <h2 className="heading-section">{ENGAGEMENT_TITLE}</h2>
          </div>
        </SimpleAnimation>

        <SimpleAnimation type="slide-up" delay={100}>
          <div className="mb-8 grid grid-cols-1 gap-4 border-y border-black/10 py-6 sm:grid-cols-3">
            {STATS_DATA.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mb-1 text-title-sm font-bold text-secondary-orange sm:text-title-md">
                  {stat.number}
                </div>
                <div className="text-body-xs text-black sm:text-body-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </SimpleAnimation>

        <SimpleAnimation type="slide-up" delay={150}>
          <div className="space-y-6 text-body text-black">
            <p className="text-text">{ENGAGEMENT_BODY}</p>
            <p className="text-body-sm italic text-secondary-orange">{ENGAGEMENT_HIGHLIGHT}</p>
          </div>
        </SimpleAnimation>
      </div>
    </div>
  );
}
