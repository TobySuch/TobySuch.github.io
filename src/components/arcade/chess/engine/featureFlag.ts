// The vs-engine mode is only enabled when PUBLIC_CHESS_ENGINE_URL is set at build time
// (e.g. in a local .env). Production builds don't set it, so the mode stays disabled.
export const ENGINE_URL: string | undefined = import.meta.env.PUBLIC_CHESS_ENGINE_URL
export const ENGINE_ENABLED = !!ENGINE_URL
