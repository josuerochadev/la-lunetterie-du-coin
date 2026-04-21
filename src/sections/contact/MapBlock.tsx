import { m, useTransform } from 'framer-motion';
import Car from 'lucide-react/dist/esm/icons/car';
import TrainFront from 'lucide-react/dist/esm/icons/train-front';
import Bus from 'lucide-react/dist/esm/icons/bus';
import Footprints from 'lucide-react/dist/esm/icons/footprints';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Accessibility from 'lucide-react/dist/esm/icons/accessibility';

import { LocationItem } from './ContactLocation';

import ResponsiveImage from '@/components/common/ResponsiveImage';
import LinkCTA from '@/components/common/LinkCTA';
import { useScrollEntrance } from '@/hooks/useScrollEntrance';
import { useManualScrollProgress } from '@/hooks/useManualScrollProgress';

// ---------------------------------------------------------------------------
// Desktop — scroll-driven parallax image + 2×2 directory (mirrors ContactInfo)
// ---------------------------------------------------------------------------

export default function MapBlock() {
  const { ref, scrollYProgress } = useManualScrollProgress('start-start');

  // Parallax image — slow vertical drift across the pin
  const imageY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1, 1.02]);

  const title = useScrollEntrance(scrollYProgress, 0.0, 0.08);
  const cards = useScrollEntrance(scrollYProgress, 0.06, 0.18);
  const footer = useScrollEntrance(scrollYProgress, 0.12, 0.24, 30);

  // Exit — gentle fade when section unpins
  const exitOpacity = useTransform(scrollYProgress, [0.75, 0.9], [1, 0]);
  const exitY = useTransform(scrollYProgress, [0.75, 0.9], [0, -30]);

  return (
    <div ref={ref} className="relative hidden h-[250vh] w-full xl:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Parallax background image */}
        <div className="absolute inset-0 overflow-hidden">
          <m.div className="absolute inset-0" style={{ y: imageY, scale: imageScale }}>
            <ResponsiveImage
              src="/images/contact-informations-boutique-outside.jpg"
              alt="Façade de La Lunetterie du Coin"
              className="h-full w-full object-cover"
              loading="lazy"
              widths={[640, 1024, 1280, 1920]}
              sizes="100vw"
            />
          </m.div>
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/65" aria-hidden="true" />
        </div>

        <m.div
          className="relative z-10 flex h-full items-center"
          style={{ opacity: exitOpacity, y: exitY }}
        >
          <div className="mx-auto max-w-[1400px] px-container-x">
            <m.div style={{ opacity: title.opacity, y: title.y }}>
              <h2 className="heading-section mb-16 text-center text-white">Comment venir</h2>
            </m.div>

            {/* 2×2 directory grid — mirrors ContactInfo layout */}
            <m.div
              className="grid grid-cols-2 gap-x-[6vw] gap-y-16"
              style={{ opacity: cards.opacity, y: cards.y }}
            >
              <LocationItem icon={Car} title="En voiture">
                <div className="space-y-2 text-body text-secondary-blue">
                  <p>
                    <span className="font-medium text-white">
                      Parking Halles &amp; Opéra Broglie
                    </span>
                    <br />
                    ~10 min à pied
                  </p>
                </div>
              </LocationItem>

              <LocationItem icon={TrainFront} title="En tram">
                <div className="space-y-2 text-body text-secondary-blue">
                  <p>
                    <span className="font-medium text-white">B · C · F</span> — arrêt Broglie
                    <br />
                    <span className="opacity-70">7 min à pied</span>
                  </p>
                  <p>
                    <span className="font-medium text-white">A · D</span> — Anc. Synagogue / Halles
                    <br />
                    <span className="opacity-70">7 min à pied</span>
                  </p>
                </div>
              </LocationItem>

              <LocationItem icon={Bus} title="En bus">
                <div className="space-y-2 text-body text-secondary-blue">
                  <p>
                    <span className="font-medium text-white">C3</span> — Faubourg de Pierre
                    <br />
                    <span className="opacity-70">2 min à pied</span>
                  </p>
                  <p>
                    <span className="font-medium text-white">C6</span> — Tribunal
                    <br />
                    <span className="opacity-70">5 min à pied</span>
                  </p>
                </div>
              </LocationItem>

              <LocationItem icon={Footprints} title="À pied">
                <div className="space-y-2 text-body text-secondary-blue">
                  <p>
                    <span className="font-medium text-white">Gare centrale de Strasbourg</span>
                    <br />
                    <span className="opacity-70">15 min à pied</span>
                  </p>
                </div>
              </LocationItem>
            </m.div>

            {/* Footer — stacked and centered */}
            <m.div
              className="mt-8 flex flex-col items-center gap-4"
              style={{ opacity: footer.opacity, y: footer.y }}
            >
              <p className="flex items-center gap-3 text-body text-white">
                <Accessibility
                  className="h-5 w-5 shrink-0 text-secondary-blue"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <span>Magasin accessible aux personnes à mobilité réduite</span>
              </p>
              <LinkCTA
                href="https://maps.google.com/?q=24+rue+du+Faubourg+de+Pierre+67000+Strasbourg"
                target="_blank"
                rel="noopener noreferrer"
                icon={MapPin}
                theme="dark"
              >
                Voir sur Google Maps
              </LinkCTA>
            </m.div>
          </div>
        </m.div>
      </div>
    </div>
  );
}
