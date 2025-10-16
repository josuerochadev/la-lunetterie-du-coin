import Layout from '@/components/common/Layout';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import SectionContainer from '@/components/common/SectionContainer';
import { useNativeScroll } from '@/hooks/useNativeScroll';
import { Seo } from '@/seo/Seo';

/**
 * Page À propos (Phase 3)
 *
 * Page détaillée présentant :
 * - L'histoire de La Lunetterie du Coin
 * - Les valeurs de l'entreprise
 * - L'équipe (Romain et son équipe)
 * - L'engagement écologique
 *
 * Style minimaliste cohérent avec Phase 2
 *
 * @component
 * @returns {JSX.Element} Page À propos complète
 */
export default function AboutPage() {
  useNativeScroll();

  return (
    <>
      <Seo
        title="À propos - La Lunetterie du Coin"
        description="Découvrez l'histoire de La Lunetterie du Coin, opticien indépendant engagé depuis 2016 dans le recyclage de lunettes à Strasbourg."
        canonicalPath="/a-propos"
      />
      <Layout>
        {/* Hero Section */}
        <SectionContainer className="bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="mx-auto max-w-5xl text-center">
              <SimpleAnimation type="slide-up" delay={0}>
                <h1 className="mb-6 text-title-lg font-medium text-text">
                  À propos de La Lunetterie du Coin
                </h1>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={100}>
                <p className="text-body-lg leading-relaxed text-stone">
                  Une histoire de passion, d'engagement et de style depuis 2016
                </p>
              </SimpleAnimation>
            </div>
          </div>
        </SectionContainer>

        {/* Notre Histoire */}
        <SectionContainer className="bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Texte */}
              <div className="space-y-6">
                <SimpleAnimation type="slide-up" delay={0}>
                  <h2 className="text-title-md font-medium text-text">
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

              {/* Image */}
              <SimpleAnimation type="slide-up" delay={200}>
                <div className="relative aspect-[4/3] overflow-hidden">
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

        {/* Nos Valeurs */}
        <SectionContainer className="bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="mx-auto max-w-4xl">
              <SimpleAnimation type="slide-up" delay={0}>
                <h2 className="mb-12 text-center text-title-md font-medium text-text">
                  Nos valeurs
                </h2>
              </SimpleAnimation>

              <div className="grid gap-8 md:grid-cols-3">
                {[
                  {
                    title: 'Authenticité',
                    description:
                      'Des conseils sincères, sans pression commerciale. Nous prenons le temps de vous connaître pour trouver LA paire qui vous correspond.',
                  },
                  {
                    title: 'Engagement écologique',
                    description:
                      "Le recyclage au cœur de notre modèle. Chaque monture d'occasion sauvée, c'est un déchet en moins et une nouvelle vie pour un objet de qualité.",
                  },
                  {
                    title: 'Expertise',
                    description:
                      "10 ans d'expérience en optique. Romain et son équipe maîtrisent tous les aspects du métier, des examens de vue aux ajustements les plus délicats.",
                  },
                ].map((value, index) => (
                  <SimpleAnimation key={value.title} type="slide-up" delay={index * 100}>
                    <div className="border-t border-stone/20 pt-8">
                      <h3 className="mb-4 text-body-lg font-medium text-text">{value.title}</h3>
                      <p className="text-body leading-relaxed text-stone">{value.description}</p>
                    </div>
                  </SimpleAnimation>
                ))}
              </div>
            </div>
          </div>
        </SectionContainer>

        {/* L'équipe */}
        <SectionContainer className="bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="mx-auto max-w-4xl">
              <SimpleAnimation type="slide-up" delay={0}>
                <h2 className="mb-12 text-center text-title-md font-medium text-text">L'équipe</h2>
              </SimpleAnimation>

              <div className="space-y-12">
                {/* Romain */}
                <SimpleAnimation type="slide-up" delay={100}>
                  <div className="grid items-center gap-8 md:grid-cols-2">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src="/images/team-romain.jpg"
                        alt="Romain Corato, fondateur de La Lunetterie du Coin"
                        className="h-full w-full object-cover object-center"
                        loading="lazy"
                      />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-title-sm font-medium text-text">Romain Corato</h3>
                      <p className="text-body-sm font-medium uppercase tracking-wider text-accent">
                        Fondateur & Opticien diplômé
                      </p>
                      <p className="text-body leading-relaxed text-stone">
                        Passionné par l'optique depuis plus de 10 ans, Romain a fondé La Lunetterie
                        du Coin en 2016 avec l'envie de proposer une alternative plus humaine et
                        écologique. Expert en verres progressifs et grands myopes, il prend le temps
                        d'expliquer et de conseiller chaque client.
                      </p>
                    </div>
                  </div>
                </SimpleAnimation>

                {/* Équipe */}
                <SimpleAnimation type="slide-up" delay={200}>
                  <div className="border-t border-stone/20 pt-8">
                    <h3 className="mb-4 text-body-lg font-medium text-text">
                      Une équipe passionnée
                    </h3>
                    <p className="text-body leading-relaxed text-stone">
                      Romain s'entoure d'une équipe compétente et bienveillante, formée aux
                      dernières techniques d'optique. Ensemble, ils partagent la même philosophie :
                      offrir un service de qualité dans une ambiance chaleureuse et décontractée.
                    </p>
                  </div>
                </SimpleAnimation>
              </div>
            </div>
          </div>
        </SectionContainer>

        {/* L'engagement écologique */}
        <SectionContainer className="bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="mx-auto max-w-4xl">
              <SimpleAnimation type="slide-up" delay={0}>
                <h2 className="mb-8 text-center text-title-md font-medium text-text">
                  Notre engagement écologique
                </h2>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={100}>
                <div className="space-y-6 text-body leading-relaxed text-stone">
                  <p>
                    La mode des lunettes est l'une des industries les plus polluantes au monde.
                    Chaque année, des millions de montures finissent à la poubelle, alors qu'elles
                    pourraient être réparées, restaurées et réutilisées.
                  </p>
                  <p>
                    Chez La Lunetterie du Coin, nous avons fait le choix de lutter contre ce
                    gaspillage. Nous récupérons vos anciennes lunettes, les nettoyons, les réparons
                    si nécessaire, et leur donnons une seconde vie. En échange, vous bénéficiez
                    d'une réduction allant jusqu'à 70€ sur votre nouvel achat.
                  </p>
                  <p className="font-medium text-text">
                    Un geste simple pour la planète, une économie réelle pour vous.
                  </p>
                </div>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={200}>
                <div className="mt-12 text-center">
                  <a href="/services#recyclage" className="button-primary">
                    Découvrir notre programme de recyclage →
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
