import { STORY_TITLE, STORY_BODY, STORY_IMAGE, STORY_IMAGE_ALT } from './constants';

import LinkCTA from '@/components/common/LinkCTA';

export function StoryDesktopStatic() {
  return (
    <div className="hidden min-h-[450vh] lg:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative flex h-full items-start px-16 pt-[12vh] xl:px-20">
          <div className="w-[28%] pr-8">
            <h2 id="story-title" className="heading-section text-white">
              {STORY_TITLE}
            </h2>
          </div>

          <div className="absolute inset-y-0 left-[28%] w-[36%] px-4">
            <div className="h-full overflow-hidden">
              <img
                src={STORY_IMAGE}
                alt={STORY_IMAGE_ALT}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="ml-[36%] w-[36%] pl-8">
            <p className="text-body-xl text-white/80">{STORY_BODY}</p>
            <LinkCTA to="/a-propos" theme="dark" className="mt-8">
              Nous découvrir
            </LinkCTA>
          </div>
        </div>
      </div>
    </div>
  );
}
