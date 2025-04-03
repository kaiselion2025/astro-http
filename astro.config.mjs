// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'

import cloudflare from '@astrojs/cloudflare'

// import node from '@astrojs/node'

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',

	output: 'server',
	// adapter: node({
	// 	mode: 'standalone'
	// })
	integrations: [mdx(), sitemap()],

	adapter: cloudflare()
})
