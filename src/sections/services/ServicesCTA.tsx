import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';

export default function ServicesCTA() {
  return (
    <section
      className="relative flex min-h-screen w-full items-center bg-accent"
      data-navbar-theme="dark"
    >
      {/* Convex curve transition from black services section */}
      <div
        className="pointer-events-none absolute -top-[11vw] left-1/2 z-20 h-[45vw] w-[140vw] -translate-x-1/2 rounded-[50%] bg-accent"
        data-navbar-theme="dark"
        aria-hidden="true"
      />

      {/* Eye motif — circle frame around content */}
      <img
        src="/images/motif-cercle.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-multiply"
      />

      <div className="relative z-10 mx-auto max-w-container px-container-x py-section">
        <div className="mx-auto max-w-4xl text-center">
          <SimpleAnimation type="slide-up" delay={0}>
            <h2
              className="text-heading text-black"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 8rem)', lineHeight: '0.95' }}
            >
              VOYEZ LA DIFFÉRENCE
            </h2>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={100}>
            <p className="mt-8 text-body-lg text-black/50">Passez nous voir, le reste suivra.</p>
          </SimpleAnimation>

          <SimpleAnimation type="fade" delay={200}>
            <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <LinkCTA to="/offres" theme="accent">
                Voir nos offres
              </LinkCTA>
              <LinkCTA to="/contact" theme="accent">
                Nous contacter
              </LinkCTA>
            </div>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
}
