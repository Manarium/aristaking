export default {
  ssr: false,
  target: 'static',
  server: {
    host: '0.0.0.0',
  },
  head: {
    titleTemplate: '%s',
    title: 'Manarium Staking App',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700,800' },
      { rel: 'icon', type: 'image/x-icon', href: '/logo.svg' },
    ],
  },
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify'],
  vuetify: {
    theme: {
      dark: true,
      themes: {
        light: {
          primary: '#1e35ca',
          secondary: '#00d2ff',
          warning: '#FF7629',
          error: '#EA202D',
          success: '#3fe578',
        },
      },
    },
  },
}
