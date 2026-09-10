'use client';

import { useCallback, useState } from 'react';
import { useToast } from './useToast';

/**
 * Reusable hook for writing text to clipboard and triggering toast notification.
 */
export function useClipboard() {
  const { toastMessage, showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string, successMessage = 'Copied to clipboard!') => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        showToast(successMessage);
        setTimeout(() => setCopied(false), 2000);
        return true;
      } catch {
        showToast('Failed to copy to clipboard');
        return false;
      }
    },
    [showToast]
  );

  return {
    copy,
    copied,
    toastMessage,
    showToast,
  };
}
