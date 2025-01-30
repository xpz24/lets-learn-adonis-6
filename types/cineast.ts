import type {
  ExtractModelRelations,
  RelationSubQueryBuilderContract,
} from '@adonisjs/lucid/types/relations'
import type Cineast from '#models/cineast'
import type Movie from '#models/movie'

interface CineastRelationsMap {
  moviesDirected: RelationSubQueryBuilderContract<typeof Movie>
  moviesWritten: RelationSubQueryBuilderContract<typeof Movie>
}

export type CineastRelationKey = keyof CineastRelationsMap &
  ExtractModelRelations<Cineast>
