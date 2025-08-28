import type React from 'react';
import { useRef, useState } from 'react';
import Send from 'lucide-react/dist/esm/icons/send';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';

import Button from '@/components/common/Button';
import { FORMSPREE_ENDPOINT } from '@/config/constants';

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
  const messageRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    setFieldErrors({});

    // Tactile feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setStatus('success');
        form.reset();
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]); // Success pattern
        }
        setTimeout(() => {
          messageRef.current?.focus();
        }, 100);
      } else {
        setStatus('error');

        // Try to get specific errors from response
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
            setError('Une erreur est survenue. Vérifiez votre connexion ou réessayez plus tard.');
          }
        } catch {
          setError('Une erreur est survenue. Vérifiez votre connexion ou réessayez plus tard.');
        }

        setTimeout(() => {
          messageRef.current?.focus();
        }, 100);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      setStatus('error');

      if (err instanceof Error && err.name === 'AbortError') {
        setError('La requête a pris trop de temps. Vérifiez votre connexion et réessayez.');
      } else {
        setError('Impossible de contacter le serveur. Veuillez réessayer plus tard.');
      }

      setTimeout(() => {
        messageRef.current?.focus();
      }, 100);
    } finally {
      setStatus('idle');
    }
  };

  return (
    <>
      {/* Área de mensagens (status/sucesso/erro) */}
      <div ref={messageRef} tabIndex={-1} aria-live="polite" className="mb-flow outline-none">
        {status === 'success' && (
          <div className="form-message--success">✅ Votre message a bien été envoyé !</div>
        )}
        {status === 'error' && <div className="form-message--error">{error}</div>}
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-sm sm:gap-md lg:grid-cols-2"
        aria-busy={status === 'sending'}
      >
        {/* Champ Nom */}
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

        {/* Champ Email */}
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

        {/* Champ Message (ocupa a linha inteira em lg+) */}
        <div className="flex min-w-0 flex-col lg:col-span-2">
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

        {/* Bouton (alinha à esquerda e ocupa a linha inteira em lg+) */}
        <div className="lg:col-span-2">
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
      </form>
    </>
  );
}
