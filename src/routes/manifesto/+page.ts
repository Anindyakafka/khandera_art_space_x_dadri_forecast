import { getManifestoContent } from '$lib/content';

export const prerender = true;

export function load() {
  return getManifestoContent();
}
