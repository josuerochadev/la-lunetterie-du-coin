import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import EyePattern from '@/components/common/EyePattern';

/**
 * Section Hero de la page À propos (Rebranding 2026)
 *
 * Fond noir, texte blanc/jaune, motif eyes.
 */
export default function AboutHero() {
  return (
    <section id="hero" className="relative w-full bg-black py-section" data-navbar-theme="light">
      <EyePattern variant="blanc" opacity={0.03} />
      <div className="mx-auto max-w-container px-container-x">
        <div className="mx-auto max-w-6xl">
          <SimpleAnimation type="slide-up" delay={0}>
            <div className="space-y-6">
              <h1 className="heading-page text-white">À propos de La Lunetterie du Coin</h1>
              <p
                className="leading-relaxed text-white/50"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
              >
                Pionnier des lunettes d'occasion à Strasbourg depuis 2016
              </p>
            </div>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
}
