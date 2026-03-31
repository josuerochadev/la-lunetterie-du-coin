import type React from 'react';
import { useState } from 'react';

import FormField from './FormField';
import FormStatusMessage from './FormStatusMessage';
import FormSubmitButton from './FormSubmitButton';

import { useFormSubmission } from '@/hooks/useFormSubmission';
import { useFormStatus } from '@/hooks/useFormStatus';
import { useFormValidation } from '@/hooks/useFormValidation';

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
  const [consentChecked, setConsentChecked] = useState(false);

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
        className="grid grid-cols-1 gap-sm sm:gap-md md:grid-cols-2"
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
          className="md:col-span-2"
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

        {/* Case à cocher RGPD — placée avant l'avertissement pour visibilité */}
        <div className="md:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-body-sm text-black">
            <input
              type="checkbox"
              name="consent"
              required
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="mt-1 h-4 w-4 flex-shrink-0 accent-secondary-green focus:ring-2 focus:ring-secondary-orange focus:ring-offset-2"
            />
            <span>
              J'accepte que mes données personnelles soient traitées dans le cadre de ma demande de
              contact. Ces données ne seront utilisées que pour répondre à votre demande et ne
              seront pas transmises à des tiers. <span className="font-medium text-text">*</span>
            </span>
          </label>
        </div>

        {/* Avertissement de confidentialité */}
        <div className="md:col-span-2">
          <div
            className="border-l-4 border-secondary-green/30 bg-secondary-green/5 p-6"
            role="note"
          >
            <p className="text-body-sm text-black">
              <span className="font-medium text-black">Important :</span> Ne transmettez pas
              d'informations confidentielles ou sensibles via ce formulaire. Pour une communication
              sécurisée, contactez-nous directement par téléphone ou prenez rendez-vous.
            </p>
          </div>
        </div>

        <FormSubmitButton status={status} animationIndex={3} disabled={!consentChecked} />
      </form>
    </>
  );
}
