import stringHelpers from '@adonisjs/core/helpers/string'
import { BaseModel, beforeCreate, column, scope } from '@adonisjs/lucid/orm'
import MovieStatuses from '#enums/movie_statuses'
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

  // Hooks
  @beforeCreate()
  static async generateSlug(movie: Movie) {
    const slug = stringHelpers.slug(movie.title, {
      replacement: '-',
      lower: true,
      strict: true,
      trim: true,
    })

    const rows = await Movie.query()
      .select('slug')
      .whereRaw('lower(??) = ?', ['slug', slug])
      .orWhereRaw('lower(??) like ?', ['slug', `${slug}-%`])
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
    // console.log(incrementorArray.length)

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
  static released = scope(async (query) => {
    await query.where(async (builder) => {
      await builder
        .whereNotNull('releasedAt')
        .where('statusId', MovieStatuses.RELEASED)
        .where('releasedAt', '<=', DateTime.now().toSQLDate())
    })
  })

  static unReleased = scope(async (query) => {
    await query.where(async (builder) => {
      await builder
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
