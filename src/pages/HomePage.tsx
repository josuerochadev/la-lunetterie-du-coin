import Layout from '@/components/common/Layout';
import Hero from '@/sections/Hero';
import OurStory from '@/sections/OurStory';
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
        title="La Lunetterie du Coin - Opticien indépendant à Strasbourg"
        description="Opticien indépendant depuis 2016. Lunettes neuves et d'occasion, lentilles de contact, examens de vue. Engagement écologique et recyclage."
        canonicalPath="/"
      />
      <LocalBusinessJsonLd />
      <div className="relative z-base">
        <Layout>
          <Hero />
          <OurStory />
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
