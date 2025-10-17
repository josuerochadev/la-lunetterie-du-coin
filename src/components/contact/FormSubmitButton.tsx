import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import type { Status } from '@/hooks/useFormStatus';

interface FormSubmitButtonProps {
  status: Status;
  animationIndex: number;
}

export default function FormSubmitButton({ status, animationIndex }: FormSubmitButtonProps) {
  const isDisabled = status === 'sending';

  return (
    <SimpleAnimation type="slide-up" delay={animationIndex * 80} className="lg:col-span-2">
      <div className="flex justify-center pt-4">
        <button
          type="submit"
          disabled={isDisabled}
          className="inline-flex items-center gap-2 border border-accent bg-accent px-6 py-3 text-body font-medium text-cream transition-all hover:bg-accent/90 focus-visible:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={isDisabled ? 'Envoi en cours' : 'Envoyer le message'}
        >
          {isDisabled ? 'Envoi en cours...' : 'Envoyer'}
        </button>
      </div>
    </SimpleAnimation>
  );
}
