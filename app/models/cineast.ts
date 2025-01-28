import { BaseModel, column, computed, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
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

  @computed()
  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}
