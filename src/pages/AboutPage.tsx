import Heart from 'lucide-react/dist/esm/icons/heart';
import Leaf from 'lucide-react/dist/esm/icons/leaf';
import Award from 'lucide-react/dist/esm/icons/award';

import { useNativeScroll } from '@/hooks/useNativeScroll';
import Layout from '@/components/common/Layout';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import SectionContainer from '@/components/common/SectionContainer';
import { Seo } from '@/seo/Seo';
import { CALENDLY_URL } from '@/config/constants';

/**
 * Page À propos - Style éditorial cohérent avec Homepage
 *
 * Ajustements subtils pour cohérence Kinfolk :
 * - Taglines uppercase sur sections clés
 * - Icônes sur valeurs (Heart, Leaf, Award)
 * - Stats visuelles dans engagement
 * - Citation Romain en blockquote
 * - Images en ratio portrait (2/3, 3/4)
 * - Garde layouts variés (50/50, grids)
 *
 * @component
 * @returns {JSX.Element} Page À propos avec ajustements éditoriaux
 */
export default function AboutPage() {
  useNativeScroll();

  const values = [
    {
      title: 'Authenticité',
      description:
        'Des conseils sincères, sans pression commerciale. Nous prenons le temps de vous connaître pour trouver LA paire qui vous correspond.',
      icon: Heart,
    },
    {
      title: 'Engagement écologique',
      description:
        "Le recyclage au cœur de notre modèle. Chaque monture d'occasion sauvée, c'est un déchet en moins et une nouvelle vie pour un objet de qualité.",
      icon: Leaf,
    },
    {
      title: 'Expertise',
      description:
        "10 ans d'expérience en optique. Romain maîtrise tous les aspects du métier, des examens de vue aux ajustements les plus délicats.",
      icon: Award,
    },
  ];

  const stats = [
    { number: '2016', label: 'Année de création' },
    { number: '2000+', label: 'Paires recyclées' },
    { number: '70€', label: 'Réduction maximum' },
  ];

  return (
    <>
      <Seo
        title="À propos - La Lunetterie du Coin"
        description="Découvrez l'histoire de La Lunetterie du Coin, opticien indépendant engagé depuis 2016 dans le recyclage de lunettes à Strasbourg."
        canonicalPath="/a-propos"
      />
      <Layout>
        {/* Hero Section - Style homepage avec hiérarchie forte */}
        <SectionContainer id="hero" className="bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="mx-auto max-w-5xl">
              <SimpleAnimation type="slide-up" delay={0}>
                <div className="space-y-6">
                  <span className="text-body-sm font-medium uppercase tracking-wider text-stone">
                    Notre histoire
                  </span>
                  <h1
                    className="font-light uppercase leading-tight tracking-wide text-text"
                    style={{ fontSize: 'clamp(2.5rem, 4vw, 5rem)' }}
                  >
                    À propos de La Lunetterie du Coin
                  </h1>
                  <p
                    className="leading-relaxed text-stone"
                    style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
                  >
                    L'opticien strasbourgeois qui révolutionne le recyclage de lunettes depuis 2016
                  </p>
                </div>
              </SimpleAnimation>
            </div>
          </div>
        </SectionContainer>

        {/* Notre Histoire - Ajout tagline + amélioration image ratio */}
        <SectionContainer id="histoire" className="bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Texte */}
              <div className="space-y-6">
                <SimpleAnimation type="slide-up" delay={0}>
                  <span className="text-body-sm font-medium uppercase tracking-wider text-stone">
                    Depuis 2016
                  </span>
                  <h2 className="mt-4 text-title-md font-medium text-text">
                    L'histoire commence en 2016
                  </h2>
                </SimpleAnimation>

                <SimpleAnimation type="slide-up" delay={100}>
                  <div className="space-y-4 text-body leading-relaxed text-stone">
                    <p>
                      Romain Corato ouvre La Lunetterie du Coin avec une conviction forte : proposer
                      des lunettes de qualité tout en respectant la planète. Dans un secteur dominé
                      par les grandes chaînes, il fait le pari de l'indépendance et de l'innovation.
                    </p>
                    <p>
                      Le concept ? Donner une seconde vie aux montures en les restaurant avec soin,
                      tout en proposant une sélection pointue de créateurs indépendants. Un modèle
                      qui allie style, accessibilité et conscience écologique.
                    </p>
                    <p>
                      Aujourd'hui, la boutique est devenue une référence à Strasbourg pour celles et
                      ceux qui cherchent des lunettes uniques, un service personnalisé et une
                      démarche qui a du sens.
                    </p>
                  </div>
                </SimpleAnimation>
              </div>

              {/* Image - Ratio portrait amélioré */}
              <SimpleAnimation type="slide-up" delay={200}>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src="/images/our-story-eyeglasses.jpg"
                    alt="Intérieur de La Lunetterie du Coin"
                    className="h-full w-full object-cover object-center"
                    loading="lazy"
                  />
                </div>
              </SimpleAnimation>
            </div>
          </div>
        </SectionContainer>

        {/* Nos Valeurs - Ajout tagline + icônes + espacement amélioré */}
        <SectionContainer id="valeurs" className="bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="mx-auto max-w-6xl">
              <SimpleAnimation type="slide-up" delay={0}>
                <div className="mb-12 text-center">
                  <span className="mb-4 inline-block text-body-sm font-medium uppercase tracking-wider text-stone">
                    Notre philosophie
                  </span>
                  <h2 className="text-title-md font-medium text-text">Nos valeurs</h2>
                </div>
              </SimpleAnimation>

              <div className="grid gap-12 md:grid-cols-3 lg:gap-16">
                {values.map((value) => {
                  const Icon = value.icon;
                  return (
                    <SimpleAnimation key={value.title} type="slide-up" delay={0}>
                      <div className="space-y-4 border-t border-stone/20 pt-6">
                        <Icon
                          className="h-8 w-8 text-accent"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                        <h3 className="text-body-lg font-medium text-text">{value.title}</h3>
                        <p className="text-body leading-relaxed text-stone">{value.description}</p>
                      </div>
                    </SimpleAnimation>
                  );
                })}
              </div>
            </div>
          </div>
        </SectionContainer>

        {/* L'équipe - Romain avec tagline + citation + image portrait */}
        <SectionContainer id="equipe" className="bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="mx-auto max-w-4xl">
              <SimpleAnimation type="slide-up" delay={0}>
                <div className="mb-12 text-center">
                  <span className="mb-4 inline-block text-body-sm font-medium uppercase tracking-wider text-stone">
                    Fondateur
                  </span>
                  <h2 className="text-title-md font-medium text-text">Romain Corato</h2>
                </div>
              </SimpleAnimation>

              {/* Romain - Image portrait 3/4 */}
              <SimpleAnimation type="slide-up" delay={100}>
                <div className="grid items-center gap-8 md:grid-cols-2">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src="/images/romain.jpg"
                      alt="Romain Corato, fondateur de La Lunetterie du Coin"
                      className="h-full w-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-title-sm font-medium text-text">Romain Corato</h3>
                      <p className="mt-2 text-body font-medium text-accent">
                        Opticien diplômé • 10 ans d'expérience
                      </p>
                    </div>
                    <p className="text-body leading-relaxed text-stone">
                      Passionné par l'optique depuis plus de 10 ans, Romain a fondé La Lunetterie du
                      Coin en 2016 avec l'envie de proposer une alternative plus humaine et
                      écologique. Expert en verres progressifs et grands myopes, il prend le temps
                      d'expliquer et de conseiller chaque client.
                    </p>
                    {/* Citation */}
                    <div className="border-l-2 border-accent pl-6">
                      <blockquote className="text-body-lg italic leading-relaxed text-text">
                        "Mon objectif ? Que chaque client reparte avec LA paire parfaite et une
                        conscience tranquille."
                      </blockquote>
                    </div>
                  </div>
                </div>
              </SimpleAnimation>
            </div>
          </div>
        </SectionContainer>

        {/* L'engagement écologique - Ajout tagline + stats visuelles */}
        <SectionContainer id="engagement" className="bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="mx-auto max-w-4xl">
              <SimpleAnimation type="slide-up" delay={0}>
                <div className="mb-8 text-center">
                  <span className="mb-4 inline-block text-body-sm font-medium uppercase tracking-wider text-stone">
                    Notre engagement
                  </span>
                  <h2 className="text-title-md font-medium text-text">
                    La mode change. La planète, non.
                  </h2>
                </div>
              </SimpleAnimation>

              {/* Statistiques visuelles */}
              <SimpleAnimation type="slide-up" delay={100}>
                <div className="mb-8 grid grid-cols-3 gap-4 border-y border-stone/20 py-6">
                  {stats.map((stat) => (
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
                    En rapportant vos anciennes lunettes, vous bénéficiez d'une réduction allant
                    jusqu'à 70€ sur votre nouvel achat. Un geste pour votre portefeuille et pour la
                    planète.
                  </p>
                  <p className="text-body-sm italic text-accent">
                    Vos vieilles lunettes au fond d'un tiroir ? Elles peuvent avoir une seconde vie
                    et vous faire économiser jusqu'à 70€.
                  </p>
                </div>
              </SimpleAnimation>
            </div>
          </div>
        </SectionContainer>

        {/* CTA Final - Simple et élégant */}
        <SectionContainer className="bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="mx-auto max-w-4xl text-center">
              <SimpleAnimation type="slide-up" delay={0}>
                <h2 className="mb-6 text-title-md font-medium text-text">
                  Envie d'en savoir plus ?
                </h2>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={100}>
                <p className="mb-8 text-body-lg text-stone">
                  Découvrez nos services ou venez nous rencontrer en boutique
                </p>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={200}>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a
                    href="/services"
                    className="inline-flex items-center gap-2 border border-accent bg-transparent px-6 py-3 text-body font-medium text-accent transition-all hover:bg-accent hover:text-cream focus-visible:bg-accent focus-visible:text-cream"
                  >
                    Découvrir nos services
                  </a>
                  <a
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-accent bg-accent px-6 py-3 text-body font-medium text-cream transition-all hover:bg-accent/90 focus-visible:bg-accent/90"
                  >
                    Prendre rendez-vous
                  </a>
                </div>
              </SimpleAnimation>
            </div>
          </div>
        </SectionContainer>
      </Layout>
    </>
  );
}
