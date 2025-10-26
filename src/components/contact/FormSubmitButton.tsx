import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import type { FormSubmissionStatus } from '@/hooks/useFormStatus';

interface FormSubmitButtonProps {
  status: FormSubmissionStatus;
  animationIndex: number;
  disabled?: boolean;
}

export default function FormSubmitButton({
  status,
  animationIndex,
  disabled = false,
}: FormSubmitButtonProps) {
  const isDisabled = status === 'sending' || disabled;

  const getButtonText = () => {
    if (status === 'sending') return 'Envoi du message en cours...';
    if (disabled) return 'Veuillez accepter les conditions';
    return 'Envoyer le message';
  };

  const getAriaLabel = () => {
    if (status === 'sending') return 'Envoi du message en cours';
    if (disabled) return 'Bouton désactivé : veuillez accepter les conditions pour envoyer';
    return 'Envoyer le message';
  };

  return (
    <SimpleAnimation type="slide-up" delay={animationIndex * 80} className="lg:col-span-2">
      <div className="flex justify-center pt-4">
        <button
          type="submit"
          disabled={isDisabled}
          className="inline-flex items-center gap-2 border border-accent bg-accent px-6 py-3 text-body font-medium text-cream transition-all hover:bg-accent/90 focus-visible:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={getAriaLabel()}
        >
          {getButtonText()}
        </button>
      </div>
    </SimpleAnimation>
  );
}
