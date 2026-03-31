import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import { HOMEPAGE_OFFERS } from '@/data/homepage';

const OFFER_COUNT = HOMEPAGE_OFFERS.length;

export function OfferMobileBlock({
  offer,
  index,
}: {
  offer: (typeof HOMEPAGE_OFFERS)[number];
  index: number;
}) {
  const number = String(index + 1).padStart(2, '0');

  return (
    <article className="py-10 lg:hidden">
      <div className="px-container-x">
        <SimpleAnimation type="fade" delay={0}>
          <img
            src={offer.image}
            alt={offer.title}
            className="h-auto w-full object-contain"
            loading="lazy"
          />
        </SimpleAnimation>
      </div>

      <div className="mt-6 px-container-x">
        <SimpleAnimation type="slide-up" delay={150}>
          <div className="group/card relative overflow-hidden rounded-r-2xl bg-black">
            <div
              className="absolute bottom-0 left-0 top-0 w-1.5 bg-secondary-blue"
              aria-hidden="true"
            />
            <div className="relative z-10 px-6 py-8">
              <span className="mb-2 block text-sm font-medium uppercase tracking-widest text-white">
                {number} / {String(OFFER_COUNT).padStart(2, '0')}
              </span>
              <h3 className="text-subtitle text-title-sm text-accent">{offer.catchphrase}</h3>
              <p className="mt-3 text-body-lg text-white">{offer.summary}</p>
              <LinkCTA
                href={offer.link}
                theme="dark"
                className="mt-5"
                aria-label={`En savoir plus sur l'offre ${offer.title}`}
              >
                En savoir plus
              </LinkCTA>
            </div>
          </div>
        </SimpleAnimation>
      </div>
    </article>
  );
}
