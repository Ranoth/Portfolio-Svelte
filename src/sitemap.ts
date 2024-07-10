import type { RO_Sitemap } from 'sveltekit-sitemap';

export const sitemap = (<const>{
   "/": true,
   "/contact": false,
   "/projets": false
}) satisfies RO_Sitemap

export type Sitemap = typeof sitemap
