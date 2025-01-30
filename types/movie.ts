import type { ExtractScopes } from '@adonisjs/lucid/types/model'
import type Movie from '#models/movie'

export interface MovieFrontMatter {
  title: string
  summary: string
}

export interface FakeMovieData {
  title: string
  releaseYear: number
}

export type MovieScopeFunction = (scopes: ExtractScopes<typeof Movie>) => void
