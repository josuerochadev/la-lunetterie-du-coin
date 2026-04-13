import { STORY_TITLE, STORY_BODY, STORY_IMAGE, STORY_IMAGE_ALT } from './constants';

import LinkCTA from '@/components/common/LinkCTA';

export function StoryDesktopStatic() {
  return (
    <div className="hidden min-h-[450vh] xl:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative h-full">
          {/* Asymmetric 3-col grid with uniform 4vw spacing:
              [4vw][title 1.5fr = 42vw][4vw][photo 14vw][4vw][body 1fr = 28vw][4vw]
              Title col gets 1.5× the body col so title-xl fits at 1280 without
              clipping the viewport. */}
          <div className="grid h-full grid-cols-[minmax(0,1.5fr)_14vw_minmax(0,1fr)] items-center gap-x-[4vw] px-[4vw]">
            <h2 id="story-title" className="heading-section text-right text-white">
              {STORY_TITLE.split(/\s+/).map((word) => (
                <span key={word} className="block">
                  {word}
                </span>
              ))}
            </h2>

            <div className="h-[60%] w-full overflow-hidden">
              <img
                src={STORY_IMAGE}
                alt={STORY_IMAGE_ALT}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            <div>
              <p className="text-body-xl text-secondary-blue">{STORY_BODY}</p>
              <LinkCTA to="/a-propos" theme="dark" className="mt-8">
                Nous découvrir
              </LinkCTA>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
