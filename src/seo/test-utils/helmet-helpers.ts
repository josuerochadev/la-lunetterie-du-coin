/**
 * Typed helpers for Helmet mock in SEO tests.
 *
 * The mocked Helmet receives JSX children as plain objects.
 * These helpers provide type-safe access to those objects.
 */
import type { Mock } from 'vitest';

/** Shape of a rendered JSX element inside the Helmet mock */
interface HelmetChild {
  type: string;
  props: Record<string, string | undefined>;
}

/** Return value of `mockHelmet.mock.calls[0][0]` */
interface HelmetCallProps {
  children: HelmetChild | HelmetChild[];
}

// ---------------------------------------------------------------------------
// Low-level accessor
// ---------------------------------------------------------------------------

/** Get the first-call props from a mocked Helmet. */
export function getHelmetProps(mockHelmet: Mock): HelmetCallProps {
  return mockHelmet.mock.calls[0][0] as HelmetCallProps;
}

/** Normalise children to an array (LocalBusinessJsonLd passes a single child). */
export function getHelmetChildren(mockHelmet: Mock): HelmetChild[] {
  const { children } = getHelmetProps(mockHelmet);
  return Array.isArray(children) ? children : [children];
}

// ---------------------------------------------------------------------------
// Finders
// ---------------------------------------------------------------------------

export function findChildByType(mockHelmet: Mock, type: string): HelmetChild | undefined {
  return getHelmetChildren(mockHelmet).find((c) => c?.type === type);
}

export function filterChildrenByType(mockHelmet: Mock, type: string): HelmetChild[] {
  return getHelmetChildren(mockHelmet).filter((c) => c?.type === type);
}

// Meta helpers
export function findMeta(
  mockHelmet: Mock,
  attr: 'name' | 'property',
  value: string,
): HelmetChild | undefined {
  return filterChildrenByType(mockHelmet, 'meta').find((m) => m.props[attr] === value);
}

export function filterMetaByPrefix(
  mockHelmet: Mock,
  attr: 'name' | 'property',
  prefix: string,
): HelmetChild[] {
  return filterChildrenByType(mockHelmet, 'meta').filter((m) => m.props[attr]?.startsWith(prefix));
}

// Link helpers
export function findLink(mockHelmet: Mock, rel: string): HelmetChild | undefined {
  return filterChildrenByType(mockHelmet, 'link').find((l) => l.props.rel === rel);
}
