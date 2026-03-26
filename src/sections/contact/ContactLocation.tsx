import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Car from 'lucide-react/dist/esm/icons/car';
import Train from 'lucide-react/dist/esm/icons/train';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';

export default function ContactLocation() {
  return (
    <section id="localisation" className="relative" data-navbar-theme="light">
      {/* Full-screen shop photo with overlay */}
      <div className="relative min-h-screen w-full">
        <img
          src="/images/contact-informations-boutique-outside.jpg"
          alt="Façade de La Lunetterie du Coin"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

        <div className="relative z-10 flex min-h-screen items-center">
          <div className="mx-auto max-w-container px-container-x py-section">
            <SimpleAnimation type="slide-up" delay={0}>
              <h2 className="heading-section mb-12 text-center text-white">Comment venir</h2>
            </SimpleAnimation>

            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2 md:gap-12">
              {/* En voiture */}
              <SimpleAnimation type="slide-right" delay={100}>
                <div className="border-t border-white/20 pt-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Car className="h-5 w-5 text-accent" aria-hidden="true" />
                    <h3 className="heading-subsection text-white">En voiture</h3>
                  </div>
                  <div className="space-y-2 text-body text-white/60">
                    <p>
                      <span className="font-medium text-white/80">Parking payant</span> : Parking
                      Halles et Opéra Broglie (environ 10 min à pied)
                    </p>
                  </div>
                </div>
              </SimpleAnimation>

              {/* En transports en commun */}
              <SimpleAnimation type="slide-left" delay={150}>
                <div className="border-t border-white/20 pt-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Train className="h-5 w-5 text-accent" aria-hidden="true" />
                    <h3 className="heading-subsection text-white">En transports</h3>
                  </div>
                  <div className="space-y-2 text-body text-white/60">
                    <p>
                      <span className="font-medium text-white/80">Tram B, C, F</span> : arrêt
                      Broglie (7 min à pied)
                    </p>
                    <p>
                      <span className="font-medium text-white/80">Tram A, D</span> : arrêt Ancienne
                      Synagogue / Les Halles (7 min à pied)
                    </p>
                    <p>
                      <span className="font-medium text-white/80">Bus C3</span> : arrêt Faubourg de
                      Pierre (2 min à pied)
                    </p>
                    <p>
                      <span className="font-medium text-white/80">Bus C6</span> : arrêt Tribunal (5
                      min à pied)
                    </p>
                    <p className="pt-2 text-white/40">
                      À 15 minutes à pied de la gare centrale de Strasbourg
                    </p>
                  </div>
                </div>
              </SimpleAnimation>

              {/* Accessibilité */}
              <SimpleAnimation type="fade" delay={200}>
                <div className="border-t border-white/20 pt-6">
                  <p className="text-body text-white/60">
                    <span className="font-medium text-white/80">Accessibilité :</span> Le magasin
                    est accessible aux personnes à mobilité réduite
                  </p>
                </div>
              </SimpleAnimation>

              {/* Google Maps */}
              <SimpleAnimation type="fade" delay={250}>
                <div className="flex items-end border-t border-white/20 pt-6">
                  <LinkCTA
                    href="https://maps.google.com/?q=24+rue+du+Faubourg+de+Pierre+67000+Strasbourg"
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={MapPin}
                    theme="dark"
                  >
                    Voir sur Google Maps
                  </LinkCTA>
                </div>
              </SimpleAnimation>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
