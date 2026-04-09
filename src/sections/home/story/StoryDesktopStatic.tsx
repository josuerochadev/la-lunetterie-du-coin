import { STORY_TITLE, STORY_BODY, STORY_IMAGE, STORY_IMAGE_ALT } from './constants';

import LinkCTA from '@/components/common/LinkCTA';

export function StoryDesktopStatic() {
  return (
    <div className="hidden min-h-[450vh] xl:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative h-full">
          {/* Symmetric 3-col grid: [5vw][1fr][5vw][18vw photo][5vw][1fr][5vw]
              minmax(0,1fr) prevents fr cols from expanding when title text
              overflows, so layout symmetry holds at any title length. */}
          <div className="grid h-full grid-cols-[minmax(0,1fr)_18vw_minmax(0,1fr)] items-center gap-x-[5vw] px-[5vw]">
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
