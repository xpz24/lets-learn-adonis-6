import type { ModelColumns, ModelRelations, OrderBy } from '@typings/model'
import type { MovieScopeFunction } from '@typings/movie'
import type Cineast from '#models/cineast'
import type Movie from '#models/movie'

export interface GetCineastsOptions {
  relationship: ModelRelations<Cineast>
  hasScopeArray?: MovieScopeFunction[]
  countObject?: Record<string, MovieScopeFunction>
  orderByArray?: OrderBy<typeof Cineast>[]
}
interface PreloadOptions {
  cineastRelationArray: ModelRelations<Cineast>[]
  movieRelationArray: ModelRelations<Movie>[]
  orderByArray: OrderBy<typeof Movie>[]
  movieScopeArray?: MovieScopeFunction[]
}
export interface GetCineastOptions {
  property: ModelColumns<typeof Cineast>
  value: string
  preloadOptions?: PreloadOptions
}
