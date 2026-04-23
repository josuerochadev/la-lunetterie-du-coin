import type { NetworkError } from '@/lib/networkErrors';

/** Erreurs de validation par champ du formulaire de contact. */
export type FormErrors = {
  /** Message d'erreur pour le champ nom. */
  name?: string;
  /** Message d'erreur pour le champ email. */
  email?: string;
  /** Message d'erreur pour le champ message. */
  message?: string;
};

/** Résultat retourné après une tentative de soumission du formulaire. */
export interface SubmissionResult {
  /** Indique si la soumission a réussi. */
  success: boolean;
  /** Message d'erreur global (affiché à l'utilisateur). */
  error?: string;
  /** Erreurs par champ retournées par le serveur. */
  fieldErrors?: FormErrors;
  /** Détails de l'erreur réseau pour affichage contextuel. */
  networkError?: NetworkError;
  /** Nombre de tentatives effectuées avant échec. */
  retryCount?: number;
}
