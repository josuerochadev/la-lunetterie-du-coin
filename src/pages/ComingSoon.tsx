// src/pages/ComingSoon.tsx
import LogoFull from '@/assets/logo/Logo_LLDC_NO_Noir.svg?react';

export default function ComingSoon() {
  return (
    <>
      <style>{`
        @keyframes reveal-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .anim-reveal {
          opacity: 0;
          animation: reveal-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .anim-dot {
          animation: pulse-dot 2.4s ease-in-out infinite;
        }
      `}</style>

      <div className="fixed inset-0 z-[9999] flex select-none flex-col overflow-hidden bg-black text-white">
        {/* Main content */}
        <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
          {/* Logo */}
          <div className="anim-reveal" style={{ animationDelay: '0.1s' }}>
            <LogoFull
              className="mx-auto h-auto w-[280px] brightness-0 invert sm:w-[400px] md:w-[500px]"
              aria-label="La Lunetterie du Coin"
              role="img"
            />
          </div>

          {/* Tagline */}
          <div
            className="anim-reveal mt-10 text-center sm:mt-12 md:mt-14"
            style={{ animationDelay: '0.5s' }}
          >
            <p
              className="text-sm uppercase tracking-[0.2em] sm:text-base md:text-lg"
              style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 300 }}
            >
              Notre nouveau site arrive bientôt
              <span className="anim-dot ml-0.5 inline-block" style={{ animationDelay: '0s' }}>
                .
              </span>
              <span className="anim-dot inline-block" style={{ animationDelay: '0.4s' }}>
                .
              </span>
              <span className="anim-dot inline-block" style={{ animationDelay: '0.8s' }}>
                .
              </span>
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer
          className="anim-reveal relative z-10 px-6 pb-8 text-center sm:pb-10"
          style={{ animationDelay: '0.8s' }}
        >
          <div
            className="mx-auto max-w-md space-y-2 text-xs tracking-wider sm:text-sm"
            style={{
              fontFamily: 'Satoshi, sans-serif',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            <p className="uppercase">Opticien — Lunetier</p>
            <div
              className="mx-auto h-px w-8"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              aria-hidden="true"
            />
            <p>En attendant, retrouvez-nous en boutique</p>
          </div>
        </footer>
      </div>
    </>
  );
}
