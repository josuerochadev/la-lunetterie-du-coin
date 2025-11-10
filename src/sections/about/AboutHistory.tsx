import { SimpleAnimation } from '@/components/motion/SimpleAnimation';

/**
 * Section Histoire de la page À propos
 *
 * Image pleine largeur avec texte superposé en bas.
 * Style cohérent avec la homepage.
 *
 * @component
 * @returns {JSX.Element} Histoire section
 */
export default function AboutHistory() {
  return (
    <section
      id="histoire"
      className="relative w-full bg-background"
      aria-labelledby="histoire-title"
    >
      {/* Image pleine largeur à hauteur naturelle */}
      <div className="relative w-full">
        <SimpleAnimation type="fade" delay={0} immediate={true}>
          <img
            src="/images/about-history-shop-indoors.png"
            alt="Intérieur de La Lunetterie du Coin"
            className="max-h-[120vh] min-h-screen w-full object-cover"
            loading="lazy"
          />
        </SimpleAnimation>

        {/* Rectangle de texte superposé en bas de l'image */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center px-4 pb-8 sm:px-8 sm:pb-12 lg:px-12 lg:pb-16">
          <SimpleAnimation type="slide-up" delay={200}>
            <div className="w-full max-w-6xl space-y-4 bg-background px-container-x py-container-y sm:space-y-6">
              <span className="text-body-sm font-medium uppercase tracking-wider text-stone">
                Depuis 2016
              </span>

              <h2 id="histoire-title" className="heading-section">
                Un peu d'histoire
              </h2>

              <p className="text-body-lg leading-relaxed text-text">
                Romain Corato ouvre La Lunetterie du Coin avec une conviction forte : proposer des
                lunettes de qualité tout en respectant la planète.
              </p>

              <p className="text-body leading-relaxed text-stone">
                Le concept ? Donner une seconde vie aux montures en les restaurant avec soin, tout
                en proposant une sélection pointue de créateurs indépendants. Un modèle qui allie
                style, accessibilité et conscience écologique.
              </p>

              <p className="text-body leading-relaxed text-stone">
                Aujourd'hui, la boutique est devenue une référence à Strasbourg pour celles et ceux
                qui cherchent des lunettes uniques, un service personnalisé et une démarche qui a du
                sens.
              </p>
            </div>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
}
