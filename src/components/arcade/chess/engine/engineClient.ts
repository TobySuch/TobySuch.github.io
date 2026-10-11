import { ENGINE_URL } from './featureFlag'

// Placeholder contract until the engine API is finalised:
//   POST {ENGINE_URL}/move  { fen }  ->  { move: "e7e8q" }  (UCI notation)
// All assumptions about the API live in this file.
export async function getEngineMove(fen: string, signal: AbortSignal): Promise<string> {
  if (!ENGINE_URL) throw new Error('Chess engine is not configured')

  const res = await fetch(new URL('/move', ENGINE_URL), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fen }),
    signal,
  })
  if (!res.ok) throw new Error(`Engine responded with ${res.status}`)

  const data: unknown = await res.json()
  const move = (data as { move?: unknown })?.move
  if (typeof move !== 'string' || !/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(move)) {
    throw new Error('Engine returned a malformed move')
  }
  return move
}
