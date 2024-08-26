export default defineNuxtConfig({
  compatibilityDate: '2024-08-23',
  ssr: true,
  css: ['vuetify/styles', '@/assets/main.scss'],
  build: {
    transpile: ['vuetify']
  },
  vite: {
    css: {
      // devSourcemap: true,
      preprocessorOptions: {
        sass: {
          api: 'modern-compiler'
        },
      },
    },
    ssr: {
      noExternal: ['vuetify']
    }
  },
  devtools: { enabled: false },
  features: {
    inlineStyles: false,
    devLogs: false,
  },
  vuetify: {
    // styles: 'none',
    styles: {
      configFile: 'assets/variables.scss',
      // useViteFileImport: true,
    },
  },
  modules: [
    //'./modules/vuetify.ts',
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
