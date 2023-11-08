/// <reference types="vite/client" />

declare module '*.vue' {
  declare module '*.vue' {
    import { defineComponent } from 'vue'
    const component: ReturnType<typeof defineComponent>
    export default component
  }
}

interface ImportMetaEnv {
  VITE_APP_TITLE: string
  VITE_APP_PORT: string
  VITE_APP_BASE_API: string
  VITE_APP_SERVER_HOST: string
  VITE_APP_BASE_PATH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'lodash-es'
