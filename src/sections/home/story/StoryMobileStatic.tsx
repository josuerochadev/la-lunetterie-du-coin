import { STORY_TITLE, STORY_BODY, STORY_IMAGE, STORY_IMAGE_ALT } from './constants';

import LinkCTA from '@/components/common/LinkCTA';

export function StoryMobileStatic() {
  return (
    <div className="lg:hidden">
      {/* Text content first */}
      <div className="px-container-x pb-16 sm:pb-20">
        <h2 id="story-title" className="text-heading text-fluid-story text-white">
          {STORY_TITLE}
        </h2>
        <p className="mt-8 text-body-xl text-secondary-blue">{STORY_BODY}</p>
        <LinkCTA to="/a-propos" theme="dark" className="mt-10 text-body-sm">
          Nous découvrir
        </LinkCTA>
      </div>

      {/* Photo — static, same proportions */}
      <div className="relative aspect-[3/2] w-[85%] overflow-hidden">
        <img
          src={STORY_IMAGE}
          alt={STORY_IMAGE_ALT}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
}
