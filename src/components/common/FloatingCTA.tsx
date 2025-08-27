import { useEffect, useRef, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import Calendar from 'lucide-react/dist/esm/icons/calendar';

import Button from '@/components/common/Button';
import { CALENDLY_URL } from '@/config/constants';

export default function FloatingCTA() {
  const [show, setShow] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(24);
  const [menuOpen, setMenuOpen] = useState(false); // NEW
  const ctaRef = useRef<HTMLDivElement>(null);

  // Observe hero CTA visibility (unchanged)
  useEffect(() => {
    const ctaBtn = document.getElementById('hero-cta');
    if (!ctaBtn) return;

    const observer = new window.IntersectionObserver(([entry]) => setShow(!entry.isIntersecting), {
      root: null,
      threshold: 0.1,
    });

    observer.observe(ctaBtn);
    return () => observer.disconnect();
  }, []);

  // Adjust bottom offset to avoid footer overlap (unchanged)
  useEffect(() => {
    const footer = document.getElementById('footer');
    if (!footer) return;

    const handleScroll = () => {
      if (!ctaRef.current || !footer) return;
      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (footerRect.top < windowHeight) {
        const overlap = windowHeight - footerRect.top;
        setBottomOffset(overlap + 24);
      } else {
        setBottomOffset(24);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // NEW — Detect if the full-screen menu is mounted (#main-menu present)
  useEffect(() => {
    const update = () => setMenuOpen(Boolean(document.getElementById('main-menu')));
    const observer = new MutationObserver(update);
    // Observe DOM changes where the menu mounts/unmounts
    observer.observe(document.body, { childList: true, subtree: true });
    update(); // initialize state on mount
    return () => observer.disconnect();
  }, []);

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.4 } },
  };

  const shouldRender = show && !menuOpen; // <- key change

  return (
    <AnimatePresence>
      {shouldRender && (
        <m.div
          ref={ctaRef}
          className="fixed right-6 z-50"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ bottom: `${bottomOffset}px`, pointerEvents: 'auto' }}
        >
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Prendre rendez-vous"
          >
            <Button className="group">
              <span className="flex items-center gap-2">
                <Calendar className="button-icon group-hover:rotate-12" />
                Prendre rendez-vous
              </span>
            </Button>
          </a>
        </m.div>
      )}
    </AnimatePresence>
  );
}
