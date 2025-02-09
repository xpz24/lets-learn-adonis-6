import stringHelpers from '@adonisjs/core/helpers/string'
import {
  BaseModel,
  beforeCreate,
  belongsTo,
  column,
  manyToMany,
  scope,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import MovieStatuses from '#enums/movie_statuses'
import Cineast from '#models/cineast'
import MovieStatus from '#models/movie_status'
import { DateTime } from 'luxon'

// import type { MovieFrontMatter } from '@typings/movie'
// import cache from '#services/cache_service'
export default class Movie extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare statusId: number

  @column()
  declare writerId: number

  @column()
  declare directorId: number

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare summary: string

  @column()
  declare abstract: string

  @column()
  declare posterUrl: string | null

  @column.dateTime()
  declare releasedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relationships
  @belongsTo(() => MovieStatus, { foreignKey: 'statusId' })
  declare status: BelongsTo<typeof MovieStatus>

  @belongsTo(() => Cineast, { foreignKey: 'writerId' })
  declare writer: BelongsTo<typeof Cineast>

  @belongsTo(() => Cineast, { foreignKey: 'directorId' })
  declare director: BelongsTo<typeof Cineast>

  @manyToMany(() => Cineast, {
    // * Because of the naming conventions we used, we do not have to explicitly define these properties.
    pivotTable: 'crew_movies',
    localKey: 'id',
    relatedKey: 'id',
    pivotForeignKey: 'movie_id',
    pivotRelatedForeignKey: 'cineast_id',
    pivotTimestamps: true,
    pivotColumns: ['title', 'sort_order'],
  })
  declare crewMembers: ManyToMany<typeof Cineast>

  @manyToMany(() => Cineast, {
    pivotTable: 'cast_movies',
    // * Eager Loading, if lazy loading use Model.related('').query().pivotColumns(['', ''])
    pivotColumns: ['character_name', 'sort_order'],
    pivotTimestamps: true,
  })
  declare castMembers: ManyToMany<typeof Cineast>

  // Hooks
  @beforeCreate()
  static async generateSlug(movie: Movie) {
    if (movie.slug) {
      return
    }

    const slug = stringHelpers.slug(movie.title, {
      replacement: '-',
      lower: true,
      strict: true,
      trim: true,
    })

    const rows = await Movie.query()
      .select('slug')
      .whereRaw('LOWER(??) = ?', ['slug', slug])
      .orWhereRaw('LOWER(??) LIKE ?', ['slug', `${slug}-%`])
    if (rows.length === 0) {
      movie.slug = slug
      return
    }

    const incrementorArray: number[] = []

    for (const row of rows) {
      const tokens = row.slug.split(`${slug}-`)
      if (tokens.length < 2) {
        continue
      } else if (!Number.isNaN(Number(tokens[1])) && Number(tokens[1]) > 0) {
        incrementorArray.push(Number(tokens[1]))
      }
    }

    if (incrementorArray.length === 0) {
      movie.slug = `${slug}-1`
      return
    } else {
      const sortedArray = incrementorArray.sort((a, b) => a - b)
      for (const [index, incrementor] of sortedArray.entries()) {
        if (incrementor !== index + 1) {
          movie.slug = `${slug}-${(index + 1).toString()}`
          return
        }
      }
      movie.slug = `${slug}-${(sortedArray.length + 1).toString()}`
    }
  }

  // Scopes
  static released = scope((query) => {
    return query.where((builder) => {
      return builder
        .whereNotNull('releasedAt')
        .where('statusId', MovieStatuses.RELEASED)
        .where('releasedAt', '<=', DateTime.now().toSQLDate())
    })
  })

  static unReleased = scope((query) => {
    return query.where((builder) => {
      return builder
        .whereNull('releasedAt')
        .orWhereNot('statusId', MovieStatuses.RELEASED)
        .orWhere('releasedAt', '>', DateTime.now().toSQLDate())
    })
  })
  // static getSlug(filename: string): string {
  //   if (!filename.endsWith('.md')) {
  //     throw new Error(`Incorrect file type, expecting a markdown file but got: ${filename}`)
  //   }

  //   return filename.replace('.md', '')
  // }

  // static async createMovieObject(
  //   frontmatter: MovieFrontMatter,
  //   slug: string,
  //   abstract: string
  // ): Promise<Movie> {
  //   const movie = new Movie()
  //   movie.title = frontmatter.title
  //   movie.summary = frontmatter.summary
  //   movie.slug = slug
  //   movie.abstract = abstract

  //   await cache.set(slug, movie)

  //   return movie
  // }
}
