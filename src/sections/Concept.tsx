// sections/Concept.tsx
import SectionContainer from '@/components/common/SectionContainer';
import SectionTitle from '@/components/common/SectionTitle';
import RevealText from '@/components/motion/text/RevealText';
import { CONCEPT_PLAIN } from '@/config/constants';
import Picture from '@/components/common/Picture';
import { OptimizedAnimateItem } from '@/components/motion/OptimizedAnimateItem';

export default function Concept() {
  // Mots-clés à mettre en emphase
  const keywords = [
    'style',
    'conscience',
    'recyclées',
    'réduction',
    'seconde',
    'vie',
    'impact',
    'écologique',
  ];

  return (
    <SectionContainer id="concept">
      <SectionTitle title="Le Concept" />

      <div className="mt-4 font-serif text-body font-semibold leading-relaxed tracking-wider">
        <RevealText
          text={CONCEPT_PLAIN}
          className=""
          baseDelay={0.1}
          preserveWordSpacing={true}
          renderPart={(word) => (
            <span
              className={`inline-block ${
                keywords.some((keyword) => word.toLowerCase().includes(keyword.toLowerCase()))
                  ? 'font-black'
                  : ''
              }`}
            >
              {word}
            </span>
          )}
        />
      </div>

      <div className="mx-auto grid max-w-content grid-cols-1 gap-section-gap py-container-y md:grid-cols-2">
        <OptimizedAnimateItem
          index={0}
          type="fade-up"
          threshold={0.3}
          className="simple-hover-lift group relative aspect-[2/3] cursor-pointer overflow-hidden rounded-card"
        >
          <Picture
            srcBase="/photos/glasses"
            fallbackSrc="/photos/glasses.jpg"
            alt="Sélection de montures exposées, éclairage doux et matériaux premium."
            width={4000}
            height={6000}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute bottom-0 left-0 right-0 translate-y-full transform p-6 text-accent transition-transform duration-300 group-hover:translate-y-0">
            <h3 className="mb-2 font-serif text-title-sm font-black">Notre Sélection</h3>
            <p className="text-body-sm font-medium leading-snug">
              Montures neuves et d'occasion soigneusement choisies pour allier style et durabilité.
            </p>
          </div>
        </OptimizedAnimateItem>

        <OptimizedAnimateItem
          index={1}
          type="fade-up"
          threshold={0.3}
          className="simple-hover-lift group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-card md:aspect-[2/3]"
        >
          <Picture
            srcBase="/photos/romain"
            fallbackSrc="/photos/romain.jpg"
            alt="Romain en conseil client à la boutique, essayage de montures."
            width={3644}
            height={5466}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute bottom-0 left-0 right-0 translate-y-full transform p-6 text-accent transition-transform duration-300 group-hover:translate-y-0">
            <h3 className="mb-2 font-serif text-title-sm font-black">L'Expertise Romain</h3>
            <p className="text-body-sm font-medium leading-snug">
              Conseil personnalisé et passion de l'optique depuis plus de 10 ans à Strasbourg.
            </p>
          </div>
        </OptimizedAnimateItem>
      </div>
    </SectionContainer>
  );
}
