import { useState, useEffect, useCallback } from 'react';
import type React from 'react';
import Check from 'lucide-react/dist/esm/icons/check';
import X from 'lucide-react/dist/esm/icons/x';

import { ToastContext } from '@/lib/toastContext';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

const TOAST_DURATION = 3500;

function ToastEntry({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const iconMap = {
    success: <Check className="h-4 w-4 text-secondary-green" aria-hidden="true" />,
    error: <X className="h-4 w-4 text-red-600" aria-hidden="true" />,
    info: null,
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-slide-in-up flex items-center gap-3 border border-black/5 bg-white px-5 py-3 text-body-sm text-text shadow-lg"
    >
      {iconMap[item.type]}
      <span>{item.message}</span>
      <button
        onClick={onDismiss}
        className="ml-2 text-black transition-colors hover:text-black"
        aria-label="Fermer"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 left-1/2 z-menu flex -translate-x-1/2 flex-col gap-2">
          {toasts.map((t) => (
            <ToastEntry key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}
