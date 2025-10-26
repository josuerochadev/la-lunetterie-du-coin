import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Car from 'lucide-react/dist/esm/icons/car';
import Train from 'lucide-react/dist/esm/icons/train';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import SectionContainer from '@/components/common/SectionContainer';

/**
 * ContactLocation - Plan d'accès et comment rejoindre la boutique
 */
export default function ContactLocation() {
  return (
    <SectionContainer className="bg-background py-section" aria-labelledby="comment-rejoindre">
      <div className="mx-auto max-w-container px-container-x">
        <SimpleAnimation type="slide-up" delay={0}>
          <h2 id="comment-rejoindre" className="heading-section mb-12 text-center">
            Comment nous rejoindre
          </h2>
        </SimpleAnimation>

        <div className="mx-auto max-w-6xl">
          {/* Layout 50/50 : Photo gauche - Informations droite */}
          <SimpleAnimation type="fade" delay={100}>
            <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Photo de la boutique */}
              <div className="relative w-full">
                <div className="relative aspect-[2/3] w-full overflow-hidden">
                  <img
                    src="/images/contact-informations-boutique-outside.jpg"
                    alt="Façade de La Lunetterie du Coin"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Informations d'accès */}
              <div className="space-y-8">
                {/* En voiture */}
                <div className="border-t border-stone/20 pt-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Car className="h-5 w-5 text-accent" aria-hidden="true" />
                    <h3 className="heading-subsection">En voiture</h3>
                  </div>
                  <div className="space-y-2 text-body text-stone">
                    <p>
                      <span className="font-medium text-text">Parking payant</span> : Parking Halles
                      et Opéra Broglie (environ 10 min à pied)
                    </p>
                  </div>
                </div>

                {/* En transports en commun */}
                <div className="border-t border-stone/20 pt-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Train className="h-5 w-5 text-accent" aria-hidden="true" />
                    <h3 className="heading-subsection">En transports</h3>
                  </div>
                  <div className="space-y-2 text-body text-stone">
                    <p>
                      <span className="font-medium text-text">Tram B, C, F</span> : arrêt Broglie (7
                      min à pied)
                    </p>
                    <p>
                      <span className="font-medium text-text">Tram A, D</span> : arrêt Ancienne
                      Synagogue / Les Halles (7 min à pied)
                    </p>
                    <p>
                      <span className="font-medium text-text">Bus C3</span> : arrêt Faubourg de
                      Pierre (2 min à pied)
                    </p>
                    <p>
                      <span className="font-medium text-text">Bus C6</span> : arrêt Tribunal (5 min
                      à pied)
                    </p>
                    <p className="pt-2">À 15 minutes à pied de la gare centrale de Strasbourg</p>
                  </div>
                </div>

                {/* Accessibilité PMR */}
                <div className="border-t border-stone/20 pt-6">
                  <p className="text-body text-stone">
                    <span className="font-medium text-text">Accessibilité :</span> Le magasin est
                    accessible aux personnes à mobilité réduite
                  </p>
                </div>

                {/* Bouton Google Maps */}
                <div className="pt-4">
                  <a
                    href="https://maps.google.com/?q=24+rue+du+Faubourg+de+Pierre+67000+Strasbourg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-accent bg-transparent px-6 py-3 text-body font-medium text-accent transition-all hover:bg-accent hover:text-cream focus-visible:bg-accent focus-visible:text-cream"
                  >
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                    Voir sur Google Maps
                  </a>
                </div>
              </div>
            </div>
          </SimpleAnimation>
        </div>
      </div>
    </SectionContainer>
  );
}
