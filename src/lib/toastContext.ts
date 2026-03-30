import { createContext } from 'react';

type ToastType = 'success' | 'error' | 'info';

export type ToastContextValue = {
  // eslint-disable-next-line no-unused-vars
  toast: (message: string, type?: ToastType) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);
