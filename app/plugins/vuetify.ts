import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          dark: true,
          colors: {
            primary: '#6C63FF',
            secondary: '#3EC9A7',
            accent: '#FF6B6B',
            background: '#0F1117',
            surface: '#1A1D2E',
            'surface-variant': '#252842',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FB8C00',
          },
        },
        light: {
          dark: false,
          colors: {
            primary: '#6C63FF',
            secondary: '#3EC9A7',
            accent: '#FF6B6B',
            background: '#F5F7FF',
            surface: '#FFFFFF',
            'surface-variant': '#EEF0FF',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FB8C00',
          },
        },
      },
    },
    defaults: {
      VBtn: {
        rounded: 'lg',
        elevation: 0,
      },
      VCard: {
        rounded: 'xl',
        elevation: 0,
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
