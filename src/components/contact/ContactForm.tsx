import type React from 'react';
import { useRef, useState } from 'react';
import Send from 'lucide-react/dist/esm/icons/send';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';

import Button from '@/components/common/Button';
import { OptimizedAnimateItem } from '@/components/motion/OptimizedAnimateItem';
import { FORMSPREE_ENDPOINT } from '@/config/constants';
import { analyzeNetworkError, vibrateError, type NetworkError } from '@/lib/networkErrors';
import { fetchWithRetry } from '@/lib/retryLogic';

type Status = 'idle' | 'sending' | 'success' | 'error';

type FormErrors = {
  name?: string;
  email?: string;
  message?: string;
};

/**
 * Formulaire de contact permettant aux utilisateurs d'envoyer un message via un endpoint Formspree.
 *
 * Ce composant gère l'état du formulaire (envoi, succès, erreur), affiche des messages d'état accessibles,
 * et propose une validation personnalisée pour les champs nom, email et message.
 *
 * Fonctionnalités principales :
 * - Affichage de messages de succès ou d'erreur après soumission.
 * - Validation côté client avec messages personnalisés en français.
 * - Accessibilité améliorée grâce à l'utilisation de `aria-live` et du focus automatique sur les messages.
 * - Désactivation du bouton d'envoi pendant la soumission.
 *
 * @component
 * @example
 * <ContactForm />
 */

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [networkError, setNetworkError] = useState<NetworkError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const messageRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    setFieldErrors({});
    setNetworkError(null);
    setRetryCount(0);

    // Tactile feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    // Force readable subject for client-side
    data.append('_subject', 'Nouveau message - La Lunetterie du Coin');
    // data.append('_cc', '[email protected]'); // si tu veux te mettre en copie

    // Honeypot spam protection
    const honeypot = data.get('_gotcha');
    if (honeypot) {
      // Silently fail if honeypot is filled (bot detected)
      setStatus('success');
      form.reset();
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
      return;
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetchWithRetry(
        FORMSPREE_ENDPOINT,
        {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        },
        {
          maxAttempts: 3,
          onRetryAttempt: (attemptNumber, delay) => {
            setRetryCount(attemptNumber);
            if (import.meta.env.DEV) {
              console.log(`Retry attempt ${attemptNumber} in ${delay}ms`);
            }
          },
          onMaxAttemptsReached: () => {
            if (import.meta.env.DEV) {
              console.log('Max retry attempts reached');
            }
          },
        }
      );

      // Add debug logs to diagnose dashboard vs. code issues
      let payload: unknown = null;
      try {
        payload = await response.clone().json(); // attempt to read JSON if it exists
      } catch {
        // no-op
      }

      if (!response.ok) {
        // Error logging only in development
        if (import.meta.env.DEV) {
          console.warn('[Formspree Error]', response.status, payload);
        }
      }

      clearTimeout(timeoutId);

      if (response.ok) {
        setStatus('success');
        form.reset();
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]); // Success pattern
        }

        // Reset status after showing success message for 5 seconds
        setTimeout(() => {
          setStatus('idle');
        }, 5000);

        setTimeout(() => {
          messageRef.current?.focus();
        }, 100);
      } else {
        setStatus('error');

        // Analyse granulaire de l'erreur
        const errorInfo = analyzeNetworkError(null, response);
        setNetworkError(errorInfo);

        // Try to get specific errors from response for validation errors
        if (errorInfo.type === 'validation_error') {
          try {
            const errorData = await response.json();
            if (errorData.errors) {
              const newFieldErrors: FormErrors = {};
              for (const err of errorData.errors) {
                if (err?.field && err?.message && typeof err.field === 'string') {
                  newFieldErrors[err.field as keyof FormErrors] = err.message;
                }
              }
              setFieldErrors(newFieldErrors);
              setError('Veuillez corriger les erreurs dans le formulaire.');
            } else {
              setError(errorInfo.userMessage);
            }
          } catch {
            setError(errorInfo.userMessage);
          }
        } else {
          setError(errorInfo.userMessage);
        }

        // Vibration d'erreur
        vibrateError();

        // Reset status after showing error for 8 seconds
        setTimeout(() => {
          setStatus('idle');
          setNetworkError(null);
        }, 8000);

        setTimeout(() => {
          messageRef.current?.focus();
        }, 100);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      setStatus('error');

      // Analyse granulaire de l'erreur catch
      const errorInfo = analyzeNetworkError(err);
      setNetworkError(errorInfo);
      setError(errorInfo.userMessage);

      // Vibration d'erreur
      vibrateError();

      // Reset status after showing error for 8 seconds
      setTimeout(() => {
        setStatus('idle');
        setNetworkError(null);
      }, 8000);

      setTimeout(() => {
        messageRef.current?.focus();
      }, 100);
    }
  };

  return (
    <>
      {/* Área de mensagens (status/sucesso/erro) */}
      <div ref={messageRef} tabIndex={-1} aria-live="polite" className="mb-flow outline-none">
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
                🔄 Tentative {retryCount}/3 - {networkError.type === 'timeout' ? 'Connexion lente détectée' : 'Reconnexion en cours...'}
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

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-sm sm:gap-md lg:grid-cols-2"
        aria-busy={status === 'sending'}
      >
        {/* Champ Nom */}
        <OptimizedAnimateItem index={0} type="slide-up" threshold={0.35}>
          <div className="flex min-w-0 flex-col">
            <label htmlFor="name" className="form-label">
              Nom{' '}
              <span className="text-red-600" aria-label="requis">
                *
              </span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              maxLength={50}
              className={`form-input ${fieldErrors.name ? 'form-input--error' : ''}`}
              placeholder="Votre nom"
              autoComplete="name"
              aria-describedby="name-hint name-error"
              aria-invalid={!!fieldErrors.name}
              onInvalid={(e) =>
                (e.currentTarget as HTMLInputElement).setCustomValidity(
                  'Veuillez entrer votre nom (2 caractères minimum).',
                )
              }
              onInput={(e) => {
                (e.currentTarget as HTMLInputElement).setCustomValidity('');
                if (fieldErrors.name) {
                  setFieldErrors((prev) => ({ ...prev, name: undefined }));
                }
              }}
            />
            <div id="name-hint" className="form-hint">
              2 à 50 caractères
            </div>
            {fieldErrors.name && (
              <div id="name-error" className="form-error" role="alert">
                {fieldErrors.name}
              </div>
            )}
          </div>
        </OptimizedAnimateItem>

        {/* Champ Email */}
        <OptimizedAnimateItem index={1} type="slide-up" threshold={0.35}>
          <div className="flex min-w-0 flex-col">
            <label htmlFor="email" className="form-label">
              Email{' '}
              <span className="text-red-600" aria-label="requis">
                *
              </span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              maxLength={64}
              className={`form-input ${fieldErrors.email ? 'form-input--error' : ''}`}
              placeholder="Votre email"
              autoComplete="email"
              aria-describedby="email-hint email-error"
              aria-invalid={!!fieldErrors.email}
              onInvalid={(e) =>
                (e.currentTarget as HTMLInputElement).setCustomValidity(
                  'Veuillez entrer une adresse email valide.',
                )
              }
              onInput={(e) => {
                (e.currentTarget as HTMLInputElement).setCustomValidity('');
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
            />
            <div id="email-hint" className="form-hint">
              Format : exemple@domaine.com
            </div>
            {fieldErrors.email && (
              <div id="email-error" className="form-error" role="alert">
                {fieldErrors.email}
              </div>
            )}
          </div>
        </OptimizedAnimateItem>

        {/* Champ Message (ocupa a linha inteira em lg+) */}
        <OptimizedAnimateItem index={2} type="slide-up" threshold={0.35} className="lg:col-span-2">
          <div className="flex min-w-0 flex-col">
            <label htmlFor="message" className="form-label">
              Message{' '}
              <span className="text-red-600" aria-label="requis">
                *
              </span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              minLength={10}
              maxLength={1000}
              className={`form-input resize-none ${fieldErrors.message ? 'form-input--error' : ''}`}
              placeholder="Votre message..."
              autoComplete="message"
              aria-describedby="message-hint message-error"
              aria-invalid={!!fieldErrors.message}
              onInvalid={(e) =>
                (e.currentTarget as HTMLTextAreaElement).setCustomValidity(
                  'Votre message doit contenir au moins 10 caractères.',
                )
              }
              onInput={(e) => {
                (e.currentTarget as HTMLTextAreaElement).setCustomValidity('');
                if (fieldErrors.message) {
                  setFieldErrors((prev) => ({ ...prev, message: undefined }));
                }
              }}
            />
            <div id="message-hint" className="form-hint">
              10 à 1000 caractères
            </div>
            {fieldErrors.message && (
              <div id="message-error" className="form-error" role="alert">
                {fieldErrors.message}
              </div>
            )}
          </div>
        </OptimizedAnimateItem>

        {/* Honeypot field - hidden from users, visible to bots */}
        <div className="hidden" aria-hidden="true">
          <input
            name="_gotcha"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            style={{ position: 'absolute', left: '-9999px' }}
          />
        </div>

        {/* Bouton (alinha à esquerda e ocupa a linha inteira em lg+) */}
        <OptimizedAnimateItem index={3} type="slide-up" threshold={0.35} className="lg:col-span-2">
          <div>
            <Button type="submit" disabled={status === 'sending'} className="group mt-2">
              <span className="flex items-center gap-2">
                {status === 'sending' ? (
                  <Loader2 className="button-icon animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="button-icon group-hover:rotate-12" aria-hidden="true" />
                )}
                {status === 'sending' ? 'Envoi en cours...' : 'Envoyer'}
              </span>
            </Button>
          </div>
        </OptimizedAnimateItem>
      </form>
    </>
  );
}
