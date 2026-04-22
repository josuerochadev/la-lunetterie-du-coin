import { OFFER_COUNT } from './OffersContent.timeline';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import { type OfferData } from '@/data/offers';

export default function OfferStaticBlock({ offer, index }: { offer: OfferData; index: number }) {
  return (
    <article className="py-10">
      <SimpleAnimation type="fade" delay={0}>
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm">
          <img
            src={offer.image}
            alt={offer.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </SimpleAnimation>

      <SimpleAnimation type="slide-up" delay={150}>
        <div className="mt-6 space-y-4">
          <span className="text-body-sm font-medium uppercase tracking-widest text-black">
            {String(index + 1).padStart(2, '0')} / {String(OFFER_COUNT).padStart(2, '0')}
          </span>
          <h3 className="text-subtitle text-title-sm text-black">{offer.catchphrase}</h3>
          <p className="text-body-lg text-black">{offer.description}</p>

          <ul className="grid grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-6">
            {offer.details.map((detail, i) => (
              <li key={i} className="flex gap-2.5 text-body-sm text-black">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary-orange"
                  aria-hidden="true"
                />
                <span>{detail}</span>
              </li>
            ))}
          </ul>

          <div className="group/cond relative overflow-hidden rounded-r-2xl bg-black/[0.04]">
            <div
              className="absolute bottom-0 left-0 top-0 w-1.5 bg-secondary-blue"
              aria-hidden="true"
            />
            <div className="py-4 pl-6 pr-5">
              <h4 className="mb-2 text-body-sm font-medium text-black">Conditions</h4>
              <ul className="space-y-1">
                {offer.conditions.map((condition, i) => (
                  <li key={i} className="text-body-sm text-black">
                    {condition}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <LinkCTA to="/contact" theme="light" aria-label={`Profiter de ${offer.title}`}>
            En profiter
          </LinkCTA>
        </div>
      </SimpleAnimation>
    </article>
  );
}
