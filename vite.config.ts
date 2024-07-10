import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { sitemapPlugin } from 'sveltekit-sitemap';

export default defineConfig({
	plugins: [sveltekit(), sitemapPlugin()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
