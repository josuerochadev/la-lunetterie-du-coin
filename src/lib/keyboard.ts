import type React from 'react';

/**
 * Vérifie si la touche pressée est une touche de bascule (toggle), c'est-à-dire "Entrée" ou "Espace".
 *
 * @param e - L'événement clavier React à analyser.
 * @returns `true` si la touche pressée est "Entrée" ou "Espace", sinon `false`.
 */

export const isToggleKey = (e: React.KeyboardEvent) => e.key === 'Enter' || e.key === ' ';
