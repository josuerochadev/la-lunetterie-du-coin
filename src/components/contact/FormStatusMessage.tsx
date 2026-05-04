import type React from 'react';

import type { FormSubmissionStatus } from '@/hooks/useFormStatus';
import type { NetworkError } from '@/lib/networkErrors';

interface FormStatusMessageProps {
  status: FormSubmissionStatus;
  error: string;
  networkError: NetworkError | null;
  retryCount: number;
  messageRef: React.RefObject<HTMLDivElement | null>;
}

export default function FormStatusMessage({
  status,
  error,
  networkError,
  retryCount,
  messageRef,
}: FormStatusMessageProps) {
  if (status === 'idle') {
    return null;
  }

  return (
    <div
      ref={messageRef}
      tabIndex={-1}
      role="status"
      aria-live="polite"
      className="mb-flow outline-none"
    >
      {status === 'success' && (
        <div className="form-message--success">
          ✅ <strong>Message envoyé avec succès !</strong>
          <br />
          <span className="text-sm opacity-90">
            Nous vous répondrons dans les plus brefs délais à l'adresse email indiquée.
          </span>
        </div>
      )}

      {status === 'error' && (
        <div className="form-message--error">
          {error}
          {networkError && retryCount > 0 && (
            <div className="mt-2 text-sm opacity-80">
              🔄 Tentative {retryCount}/3 -{' '}
              {networkError.type === 'timeout'
                ? 'Connexion lente détectée'
                : 'Reconnexion en cours...'}
            </div>
          )}
        </div>
      )}

      {status === 'sending' && retryCount > 0 && (
        <div className="form-message--info">
          🔄 Reconnexion en cours... (Tentative {retryCount}/3)
        </div>
      )}
    </div>
  );
}
