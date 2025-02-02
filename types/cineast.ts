import type { ExtractModelRelations } from '@adonisjs/lucid/types/relations'
import type { ModelColumns, OrderBy } from '@typings/model'
import type { MovieScopeFunction } from '@typings/movie'
import type Cineast from '#models/cineast'
import type Movie from '#models/movie'

export interface GetCineastsOptions {
  relationship: ExtractModelRelations<Cineast>
  hasScopeArray?: MovieScopeFunction[]
  countObject?: Record<string, MovieScopeFunction>
  orderByArray?: OrderBy<typeof Cineast>[]
}
interface PreloadOptions {
  cineastRelationArray: ExtractModelRelations<Cineast>[]
  movieRelationArray: ExtractModelRelations<Movie>[]
  orderByArray: OrderBy<typeof Movie>[]
  movieScopeArray?: MovieScopeFunction[]
}
export interface GetCineastOptions {
  property: ModelColumns<typeof Cineast>
  value: string
  preloadOptions?: PreloadOptions
}
