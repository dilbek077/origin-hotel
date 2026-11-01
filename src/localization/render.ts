import type { ReactNode } from 'react';

// Localize text nodes without adding DOM elements or touching user-entered values.
export function localizeChildren(children: ReactNode, text: (value: string) => string): ReactNode {
  if (typeof children === 'string') return text(children);
  if (Array.isArray(children)) return children.map((child) => localizeChildren(child, text));
  return children;
}
