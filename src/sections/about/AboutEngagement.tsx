import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import { STATS_DATA } from '@/data/about';

/**
 * Section Engagement Écologique de la page À propos
 *
 * Affiche des statistiques clés et décrit l'engagement écologique
 * de La Lunetterie du Coin.
 *
 * @component
 * @returns {JSX.Element} Engagement section
 */
export default function AboutEngagement() {
  return (
    <section id="engagement" className="relative w-full bg-background py-section">
      <div className="mx-auto max-w-container px-container-x">
        <div className="mx-auto max-w-6xl">
          <SimpleAnimation type="slide-up" delay={0}>
            <div className="mb-8 text-center">
              <span className="mb-4 inline-block text-body-sm font-medium uppercase tracking-wider text-stone">
                Notre engagement
              </span>
              <h2 className="heading-section">La mode change. La planète, non.</h2>
            </div>
          </SimpleAnimation>

          {/* Statistiques visuelles */}
          <SimpleAnimation type="slide-up" delay={100}>
            <div className="mb-8 grid grid-cols-3 gap-4 border-y border-stone/20 py-6">
              {STATS_DATA.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="mb-1 text-title-sm font-bold text-accent sm:text-title-md">
                    {stat.number}
                  </div>
                  <div className="text-body-xs text-stone sm:text-body-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={150}>
            <div className="space-y-6 text-body leading-relaxed text-stone">
              <p className="text-text">
                Depuis 2016, nous proposons une alternative durable au marché traditionnel de
                l'optique. Nos montures d'occasion sont soigneusement restaurées, donnant une
                seconde vie à des pièces qui auraient fini à la décharge.
              </p>
              <p>
                En rapportant vos anciennes lunettes, vous bénéficiez d'une réduction allant jusqu'à
                70€ sur votre nouvel achat. Un geste pour votre portefeuille et pour la planète.
              </p>
              <p className="text-body-sm italic text-accent">
                Vos lunettes oubliées au fond d'un tiroir ? Elles peuvent avoir une seconde vie et
                vous faire économiser jusqu'à 70€.
              </p>
            </div>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
}
