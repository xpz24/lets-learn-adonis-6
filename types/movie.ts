import type { ExtractScopes } from '@adonisjs/lucid/types/model'
import type { ModelColumns, ModelRelations, OrderBy } from '@typings/model'
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

export interface GetMoviesOptions {
  limit?: number
  preloadArray?: ModelRelations<Movie>[]
  scopeFunctionArray?: MovieScopeFunction[]
  orderByArray?: OrderBy<typeof Movie>[]
  whereNotNullArray?: ModelColumns<typeof Movie>[]
}

export interface GetMovieOptions {
  property: ModelColumns<typeof Movie>
  value: string
  preloadArray?: ModelRelations<Movie>[]
}
