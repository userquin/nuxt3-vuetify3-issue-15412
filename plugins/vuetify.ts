import { createVuetify } from 'vuetify';

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    theme: {
      defaultTheme: MAIN_THEME,
      themes: {
        mainTheme,
      },
    },
    defaults,
    icons: {
      defaultSet: 'custom',
      aliases,
      sets: { custom },
    },
  });

  app.vueApp.use(vuetify);
});
