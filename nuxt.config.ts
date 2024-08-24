import vuetify from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  compatibilityDate: '2024-08-23',
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
    inlineStyles: false,
    devLogs: false,
  },
  vuetify: {
    styles: { configFile: 'assets/variables.scss' },
  },
  modules: [
    './modules/vuetify',
    'nuxt-icon',
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
