import type React from 'react';

import { OptimizedAnimateItem } from '@/components/motion/OptimizedAnimateItem';
import type { FormErrors } from '@/hooks/useFormSubmission';

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

  const fieldId = name;
  const hintId = `${name}-hint`;
  const errorId = `${name}-error`;

  const renderField = () => {
    const commonProps = {
      id: fieldId,
      name,
      required,
      className: `form-input ${hasError ? 'form-input--error' : ''}`,
      'aria-describedby': `${hintId} ${errorId}`,
      'aria-invalid': hasError,
      onInvalid,
      onInput,
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
    <OptimizedAnimateItem
      index={animationIndex}
      type="slide-up"
      threshold={0.35}
      className={className}
    >
      <div className="flex min-w-0 flex-col">
        <label htmlFor={fieldId} className="form-label">
          {label}
          {required && (
            <span className="text-red-600" aria-label="requis">
              {' '}*
            </span>
          )}
        </label>
        
        {renderField()}
        
        <div id={hintId} className="form-hint">
          {hint}
        </div>
        
        {hasError && errorMessage && (
          <div id={errorId} className="form-error" role="alert">
            {errorMessage}
          </div>
        )}
      </div>
    </OptimizedAnimateItem>
  );
}