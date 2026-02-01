import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://nuclearplayer.github.io/nuclear-xrd',
  output: 'static',
  integrations: [sitemap(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
});
