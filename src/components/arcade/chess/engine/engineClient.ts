import { ENGINE_URL } from './featureFlag'

// Engine API contract:
//   POST {ENGINE_URL}/move  { fen }  ->  {
//     move: "e7e5",                       (UCI notation)
//     lines: [{                           (principal variations, any number, best first)
//       moves: ["e7e5", "f1c1", ...],     (UCI, starting from the requested position)
//       visits: 481,
//       evaluation: { winRate: 0.52, centipawns: 24 },
//     }, ...]
//   }
// All assumptions about the API live in this file.

export interface EngineLine {
  moves: string[]
  visits: number
  evaluation: { winRate: number; centipawns: number }
}

export interface EngineResponse {
  move: string
  lines: EngineLine[]
}

const UCI_MOVE = /^[a-h][1-8][a-h][1-8][qrbn]?$/

const isFiniteNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)

function parseLine(raw: unknown): EngineLine | null {
  const { moves, visits, evaluation } = (raw ?? {}) as Record<string, unknown>
  const { winRate, centipawns } = (evaluation ?? {}) as Record<string, unknown>
  if (!Array.isArray(moves) || !moves.every(m => typeof m === 'string' && UCI_MOVE.test(m))) return null
  if (!isFiniteNumber(visits) || !isFiniteNumber(winRate) || !isFiniteNumber(centipawns)) return null
  return { moves, visits, evaluation: { winRate, centipawns } }
}

export async function getEngineMove(fen: string, signal: AbortSignal): Promise<EngineResponse> {
  if (!ENGINE_URL) throw new Error('Chess engine is not configured')

  const res = await fetch(new URL('/move', ENGINE_URL), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fen }),
    signal,
  })
  if (!res.ok) throw new Error(`Engine responded with ${res.status}`)

  const data = (await res.json()) as { move?: unknown; lines?: unknown }
  const move = data?.move
  if (typeof move !== 'string' || !UCI_MOVE.test(move)) {
    throw new Error('Engine returned a malformed move')
  }
  // Lines are informational only, so drop malformed ones rather than failing the move.
  const lines = Array.isArray(data.lines)
    ? data.lines.map(parseLine).filter((l): l is EngineLine => l !== null)
    : []
  return { move, lines }
}
