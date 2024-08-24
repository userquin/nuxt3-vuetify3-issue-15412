import vuetify from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  compatibilityDate: '2024-08-23',
  css: ['vuetify/styles', '@/assets/main.scss'],
  build: {
    transpile: ['vuetify']
  },
  vite: {
    plugins: [{
      name: 'check',
      enforce: 'post',
      configResolved(config) {
        console.log(config.css)
      }
    }],
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        sass: {
          api: 'modern-compiler'
        },
        /* prepare some tests for vuetify styles plugin: virtual
        scss: {
          api: 'modern',
          importers: [
            {
              canonicalize(url: string) {
                console.log('URL: ' + url)
                return url === 'virtual-dep'
                    ? new URL('custom-importer:virtual-dep')
                    : null
              },
              load() {
                console.log('WTF')
                return {
                  contents: ``,
                  syntax: 'scss',
                }
              },
            },
          ]
        }
        */
      },
      // preprocessorMaxWorkers: true,
    },
    ssr: {
      noExternal: ['vuetify']
    }
  },
  devtools: { enabled: true },
  features: {
    inlineStyles: false,
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
