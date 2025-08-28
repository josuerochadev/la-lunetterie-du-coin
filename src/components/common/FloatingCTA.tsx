import { useEffect, useRef, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import Calendar from 'lucide-react/dist/esm/icons/calendar';

import Button from '@/components/common/Button';
import { CALENDLY_URL } from '@/config/constants';

export default function FloatingCTA() {
  const [show, setShow] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(24);
  const [menuOpen, setMenuOpen] = useState(false);
  const [inContactSection, setInContactSection] = useState(false);
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

  // Adjust bottom offset to align with send button or avoid footer overlap
  useEffect(() => {
    const footer = document.getElementById('footer');
    const contactForm = document.querySelector('form[aria-busy]'); // Le formulaire de contact
    const sendButton = contactForm?.querySelector('button[type="submit"]');

    if (!footer) return;

    const handleScroll = () => {
      if (!ctaRef.current || !footer) return;

      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      let newBottomOffset = 24;

      // Si on est dans la section contact et qu'on peut voir le bouton Envoyer
      if (sendButton && inContactSection) {
        const sendButtonRect = sendButton.getBoundingClientRect();

        // Si le bouton Envoyer est visible, s'aligner avec lui
        if (sendButtonRect.bottom > 0 && sendButtonRect.top < windowHeight) {
          const distanceFromBottom = windowHeight - sendButtonRect.bottom;
          newBottomOffset = Math.max(distanceFromBottom, 24);
        }
        // Si on a scrollé au-delà du bouton Envoyer, garder la dernière position connue
        else if (sendButtonRect.bottom <= 0) {
          // Garder la position fixe du bouton Envoyer (ne plus bouger)
          newBottomOffset = bottomOffset; // Garde la valeur actuelle
        }
      }
      // Sinon, logique normale pour éviter le footer
      else if (footerRect.top < windowHeight) {
        const overlap = windowHeight - footerRect.top;
        newBottomOffset = overlap + 24;
      }

      setBottomOffset(newBottomOffset);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [inContactSection, bottomOffset]);

  // Detect if the full-screen menu is mounted (#main-menu present)
  useEffect(() => {
    const update = () => setMenuOpen(Boolean(document.getElementById('main-menu')));
    const observer = new MutationObserver(update);
    // Observe DOM changes where the menu mounts/unmounts
    observer.observe(document.body, { childList: true, subtree: true });
    update(); // initialize state on mount
    return () => observer.disconnect();
  }, []);

  // Detect when we're in contact section to adjust positioning
  useEffect(() => {
    const contactSection = document.getElementById('contact');
    if (!contactSection) return;

    const observer = new window.IntersectionObserver(
      ([entry]) => setInContactSection(entry.isIntersecting),
      {
        root: null,
        threshold: 0.3, // Trigger when 30% of contact section is visible
      },
    );

    observer.observe(contactSection);
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
          className="fixed right-container-x z-50"
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
