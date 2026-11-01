import { createElement, type ComponentType, type JSX, type ReactNode } from 'react';
import { useTranslation } from '@/i18n';
import { localizeChildren } from './render';

type LocalizedElements = { [Tag in keyof JSX.IntrinsicElements]: ComponentType<JSX.IntrinsicElements[Tag]> };
const cache = new Map<string, ComponentType<Record<string, unknown>>>();
const textAttributes = ['aria-label', 'aria-description', 'aria-valuetext', 'placeholder', 'title', 'alt', 'label'];

// Each cached component renders the same native tag and forwards refs/events.
// React context updates cover portals and content opened after a language change.
export const L = new Proxy({} as LocalizedElements, {
  get(_target, tag: string) {
    let component = cache.get(tag);
    if (!component) {
      function LocalizedElement(props: Record<string, unknown>) {
        const { text } = useTranslation();
        const localized = { ...props };
        for (const attribute of textAttributes) {
          if (typeof localized[attribute] === 'string') localized[attribute] = text(localized[attribute]);
        }
        if (!['textarea', 'code', 'pre', 'script', 'style'].includes(tag)) {
          localized.children = localizeChildren(props.children as ReactNode, text);
        }
        return createElement(tag, localized);
      }
      LocalizedElement.displayName = `Localized.${tag}`;
      component = LocalizedElement;
      cache.set(tag, component);
    }
    return component;
  },
});
