import { SimpleAnimation } from '@/components/motion/SimpleAnimation';

/**
 * Section Équipe de la page À propos
 *
 * Présente Romain Corato, le fondateur de La Lunetterie du Coin,
 * avec une image portrait et une description.
 *
 * @component
 * @returns {JSX.Element} Équipe section
 */
export default function AboutTeam() {
  return (
    <section id="equipe" className="relative w-full bg-background py-section">
      <div className="mx-auto max-w-container px-container-x">
        <div className="mx-auto max-w-6xl">
          <SimpleAnimation type="slide-up" delay={0}>
            <div className="mb-12 text-center">
              <span className="mb-4 inline-block text-body-sm font-medium uppercase tracking-wider text-stone">
                L'opticien fondateur
              </span>
              <h2 className="heading-section">Romain</h2>
            </div>
          </SimpleAnimation>

          {/* Romain - Image portrait 3/4 */}
          <SimpleAnimation type="slide-up" delay={100}>
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src="/images/about-team-romain.jpg"
                  alt="Romain Corato, fondateur de La Lunetterie du Coin"
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                />
              </div>
              <div className="space-y-6">
                <p className="text-body leading-relaxed text-stone">
                  Passionné par l'optique depuis plus de 15 ans, Romain a fondé La Lunetterie du
                  Coin en 2016 avec l'envie de proposer une alternative plus humaine et écologique.
                  Expert en verres progressifs et grands myopes, il prend le temps d'expliquer et de
                  conseiller chaque client.
                </p>
              </div>
            </div>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
}
