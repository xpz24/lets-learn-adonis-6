import {
  BaseModel,
  column,
  computed,
  hasMany,
  manyToMany,
} from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Movie from '#models/movie'
import { DateTime } from 'luxon'

export default class Cineast extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare headshotUrl: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relationships
  @hasMany(() => Movie, { foreignKey: 'directorId' })
  declare moviesDirected: HasMany<typeof Movie>

  @hasMany(() => Movie, { foreignKey: 'writerId' })
  declare moviesWritten: HasMany<typeof Movie>

  @manyToMany(() => Movie, {
    // * Because of the naming conventions we used, we do not have to explicitly define these properties.
    pivotTable: 'crew_movies',
    localKey: 'id',
    relatedKey: 'id',
    pivotForeignKey: 'cineast_id',
    pivotRelatedForeignKey: 'movie_id',
    pivotTimestamps: true,
  })
  declare crewMovies: ManyToMany<typeof Movie>

  @manyToMany(() => Movie, {
    pivotTable: 'cast_movies',
    // * Eager Loading
    pivotColumns: ['character_name', 'sort_order'],
    pivotTimestamps: true,
  })
  declare castMovies: ManyToMany<typeof Movie>

  @computed()
  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}
