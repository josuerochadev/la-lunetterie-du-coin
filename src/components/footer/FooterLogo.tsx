import Logo from '@/components/common/Logo';

/**
 * FooterLogo - Logo et slogan du footer (rebranding 2026)
 */
export default function FooterLogo() {
  return (
    <div className="mx-auto mb-8 text-center">
      <div className="mb-2 flex justify-center">
        <Logo variant="full" color="jaune" size="md" />
      </div>
      <p className="text-body-sm text-white">Neuf & Occasion. Depuis 2016.</p>
    </div>
  );
}
