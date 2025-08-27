import Contact from '@/sections/Contact';
import FloatingCTA from '@/components/common/FloatingCTA';
import Layout from '@/components/common/Layout';
import Hero from '@/sections/Hero';
import Offers from '@/sections/Offers';
import Concept from '@/sections/Concept';
import Services from '@/sections/Services';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { Seo } from '@/seo/Seo';
import { LocalBusinessJsonLd } from '@/seo/LocalBusinessJsonLd';

export default function HomePage() {
  useSmoothScroll();
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
