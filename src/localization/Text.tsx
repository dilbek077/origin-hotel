import type { ReactNode } from 'react';
import { useTranslation } from '@/i18n';
import { localizeChildren } from './render';

export function LocalizedText({ children, value }: { children?: ReactNode; value?: ReactNode }) {
  const { text } = useTranslation();
  return <>{localizeChildren(value === undefined ? children : value, text)}</>;
}
