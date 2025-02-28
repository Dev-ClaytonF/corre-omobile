/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TEMPLATE_CLIENT_ID: string
  // outras variáveis de ambiente...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 