import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
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
