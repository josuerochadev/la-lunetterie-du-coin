import type React from 'react';
import { useState } from 'react';
import Check from 'lucide-react/dist/esm/icons/check';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import type { FormErrors } from '@/types/forms';

interface BaseFieldProps {
  name: keyof FormErrors;
  label: string;
  hint: string;
  required?: boolean;
  animationIndex: number;
  hasError?: boolean;
  errorMessage?: string;
  // eslint-disable-next-line no-unused-vars
  onInvalid: (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  // eslint-disable-next-line no-unused-vars
  onInput: (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className?: string;
}

interface InputFieldProps extends BaseFieldProps {
  type: 'text' | 'email';
  placeholder: string;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
}

interface TextareaFieldProps extends BaseFieldProps {
  type: 'textarea';
  placeholder: string;
  rows?: number;
  minLength?: number;
  maxLength?: number;
}

type FormFieldProps = InputFieldProps | TextareaFieldProps;

export default function FormField(props: FormFieldProps) {
  const {
    name,
    label,
    hint,
    required = false,
    animationIndex,
    hasError = false,
    errorMessage,
    onInvalid,
    onInput,
    className = '',
  } = props;

  const [charCount, setCharCount] = useState(0);
  const [touched, setTouched] = useState(false);

  const fieldId = name;
  const hintId = `${name}-hint`;
  const errorId = `${name}-error`;

  const minLength = 'minLength' in props ? props.minLength : undefined;
  const maxLength = 'maxLength' in props ? props.maxLength : undefined;
  const hasCounter = maxLength !== undefined;
  const isValid = touched && !hasError && charCount > 0 && (!minLength || charCount >= minLength);

  const handleInput = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCharCount((e.target as HTMLInputElement | HTMLTextAreaElement).value.length);
    if (!touched) setTouched(true);
    onInput(e);
  };

  const renderField = () => {
    const commonProps = {
      id: fieldId,
      name,
      required,
      className: `form-input ${hasError ? 'form-input--error' : isValid ? 'form-input--valid' : ''}`,
      'aria-describedby': `${hintId} ${errorId}`,
      'aria-invalid': hasError,
      onInvalid,
      onInput: handleInput,
      onBlur: () => setTouched(true),
    };

    if (props.type === 'textarea') {
      return (
        <textarea
          {...commonProps}
          rows={props.rows || 5}
          minLength={props.minLength}
          maxLength={props.maxLength}
          placeholder={props.placeholder}
          autoComplete="message"
          className={`${commonProps.className} resize-none`}
        />
      );
    }

    return (
      <input
        {...commonProps}
        type={props.type}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete}
        minLength={props.minLength}
        maxLength={props.maxLength}
      />
    );
  };

  return (
    <SimpleAnimation type="slide-up" delay={animationIndex * 80} className={className}>
      <div className="flex min-w-0 flex-col">
        <label htmlFor={fieldId} className="form-label">
          {label}
          {required && (
            <span className="text-red-600" aria-label="requis">
              {' '}
              *
            </span>
          )}
          {isValid && (
            <Check
              className="ml-1.5 inline-block h-4 w-4 text-secondary-green"
              aria-label="champ valide"
            />
          )}
        </label>

        {renderField()}

        <div className="mt-2 flex items-center justify-between gap-2">
          <span id={hintId} className="form-hint mt-0">
            {hint}
          </span>
          {hasCounter && (
            <span
              className={`shrink-0 text-body-xs tabular-nums ${
                maxLength && charCount > maxLength * 0.9 ? 'text-red-600' : 'text-black/40'
              }`}
              aria-live="polite"
              aria-atomic="true"
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>

        {hasError && errorMessage && (
          <div id={errorId} className="form-error" role="alert">
            {errorMessage}
          </div>
        )}
      </div>
    </SimpleAnimation>
  );
}
