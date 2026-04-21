import { createContext } from 'react';

type ToastType = 'success' | 'error' | 'info';

export type ToastContextValue = {
  toast: (message: string, type?: ToastType) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);
