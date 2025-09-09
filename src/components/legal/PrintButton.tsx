import Printer from 'lucide-react/dist/esm/icons/printer';

import Button from '@/components/common/Button';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';

type PrintButtonProps = {
  className?: string;
};

/**
 * Bouton d'impression pour les pages légales
 *
 * Déclenche l'impression de la page courante avec l'API native du navigateur.
 * Le bouton est masqué lors de l'impression via CSS print media query.
 *
 * @component
 * @param props - Les propriétés du composant
 * @returns Bouton d'impression stylisé
 */
export default function PrintButton({ className = '' }: PrintButtonProps) {
  const handlePrint = () => {
    try {
      // Focus sur le document avant impression pour assurer l'accessibilité
      if (document.body && typeof document.body.focus === 'function') {
        document.body.focus();
      }

      // Vérifier que l'API print est disponible
      if (typeof window.print === 'function') {
        window.print();
      }
    } catch (error) {
      // Afficher une erreur utilisateur en cas de problème
      console.error("Erreur lors de l'impression:", error);
    }
  };

  return (
    <div className="flex justify-center">
      <SimpleAnimation type="slide-up" delay={160}>
        <Button
          type="button"
          onClick={handlePrint}
          className={`group mt-8 print:hidden ${className}`}
          aria-label="Imprimer cette page"
        >
          <span className="flex items-center gap-2">
            <Printer className="button-icon group-hover:rotate-12" aria-hidden="true" />
            Imprimer cette page
          </span>
        </Button>
      </SimpleAnimation>
    </div>
  );
}
