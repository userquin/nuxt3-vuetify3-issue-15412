import vuetify from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  css: ['vuetify/styles', '@/assets/main.scss'],
  build: {
    transpile: ['vuetify']
  },
  vite: {
    ssr: {
      noExternal: ['vuetify']
    }
  },
  devtools: { enabled: true },
  features: {
    devLogs: false,
  },
  modules: [
    'nuxt-icon',
    async (_, nuxt) => {
      nuxt.hook('vite:extendConfig', (viteInlineConfig) => {
        viteInlineConfig.plugins = viteInlineConfig.plugins || []
        viteInlineConfig.plugins.push(vuetify({
          styles: { configFile: 'assets/variables.scss' },
        }))
      })
    },
  ],
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://rsms.me/' },
        { rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' },
      ],
    },
  },
});
