import Layout from '@/components/common/Layout';
import Hero from '@/sections/Hero';
import Offers from '@/sections/Offers';
import Services from '@/sections/Services';
import Concept from '@/sections/Concept';
import Contact from '@/sections/Contact';
import FloatingCTA from '@/components/common/FloatingCTA';
import { useNativeScroll } from '@/hooks/useNativeScroll';
import { Seo } from '@/seo/Seo';
import { LocalBusinessJsonLd } from '@/seo/LocalBusinessJsonLd';

export default function HomePage() {
  useNativeScroll();
  return (
    <>
      <Seo
        title="La Lunetterie du Coin - Opticien à Strasbourg"
        description="Montures neuves & d'occasion, conseils personnalisés, ajustage et services atelier à Strasbourg."
        canonicalPath="/"
      />
      <LocalBusinessJsonLd />
      <div className="relative z-base">
        <Layout>
          <Hero />
          <Offers />
          <Services />
          <Concept />
          <Contact />
          <FloatingCTA />
        </Layout>
      </div>
    </>
  );
}
