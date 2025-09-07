import Send from 'lucide-react/dist/esm/icons/send';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';

import Button from '@/components/common/Button';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import type { Status } from '@/hooks/useFormStatus';

interface FormSubmitButtonProps {
  status: Status;
  animationIndex: number;
}

export default function FormSubmitButton({ status, animationIndex }: FormSubmitButtonProps) {
  const isDisabled = status === 'sending';

  return (
    <SimpleAnimation
      type="slide-up"
      delay={animationIndex * 80}
      className="lg:col-span-2"
    >
      <div>
        <Button type="submit" disabled={isDisabled} className="group mt-2">
          <span className="flex items-center gap-2">
            {isDisabled ? (
              <Loader2 className="button-icon animate-spin" aria-hidden="true" />
            ) : (
              <Send className="button-icon group-hover:rotate-12" aria-hidden="true" />
            )}
            {isDisabled ? 'Envoi en cours...' : 'Envoyer'}
          </span>
        </Button>
      </div>
    </SimpleAnimation>
  );
}
