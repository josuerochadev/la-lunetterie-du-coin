import type React from 'react';

import FormField from './FormField';
import FormStatusMessage from './FormStatusMessage';
import FormSubmitButton from './FormSubmitButton';

import { useFormSubmission } from '@/hooks/useFormSubmission';
import { useFormStatus } from '@/hooks/useFormStatus';
import { useFormValidation } from '@/hooks/useFormValidation';

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
  const { submitForm } = useFormSubmission();
  const {
    status,
    error,
    fieldErrors,
    networkError,
    retryCount,
    messageRef,
    handleSubmissionStart,
    handleSubmissionResult,
    clearFieldError,
  } = useFormStatus();
  const { handleInvalidInput, handleInputChange } = useFormValidation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmissionStart();
    const result = await submitForm(e);
    handleSubmissionResult(result);
  };

  return (
    <>
      <FormStatusMessage
        status={status}
        error={error}
        networkError={networkError}
        retryCount={retryCount}
        messageRef={messageRef}
      />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-sm sm:gap-md lg:grid-cols-2"
        aria-busy={status === 'sending'}
      >
        <FormField
          name="name"
          type="text"
          label="Nom"
          hint="2 à 50 caractères"
          placeholder="Votre nom"
          required
          minLength={2}
          maxLength={50}
          autoComplete="name"
          animationIndex={0}
          hasError={!!fieldErrors.name}
          errorMessage={fieldErrors.name}
          onInvalid={handleInvalidInput}
          onInput={(e) => handleInputChange(e, 'name', clearFieldError)}
        />

        <FormField
          name="email"
          type="email"
          label="Email"
          hint="Format : exemple@domaine.com"
          placeholder="Votre email"
          required
          maxLength={64}
          autoComplete="email"
          animationIndex={1}
          hasError={!!fieldErrors.email}
          errorMessage={fieldErrors.email}
          onInvalid={handleInvalidInput}
          onInput={(e) => handleInputChange(e, 'email', clearFieldError)}
        />

        <FormField
          name="message"
          type="textarea"
          label="Message"
          hint="10 à 1000 caractères"
          placeholder="Votre message..."
          required
          minLength={10}
          maxLength={1000}
          rows={5}
          animationIndex={2}
          hasError={!!fieldErrors.message}
          errorMessage={fieldErrors.message}
          onInvalid={handleInvalidInput}
          onInput={(e) => handleInputChange(e, 'message', clearFieldError)}
          className="lg:col-span-2"
        />

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

        <FormSubmitButton status={status} animationIndex={3} />
      </form>
    </>
  );
}