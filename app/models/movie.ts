import type { MovieFrontMatter } from '@typings/movie.js'
import cache from '#services/cache_service'

export default class Movie {
  declare title: string

  declare summary: string

  declare slug: string

  declare abstract?: string

  static getSlug(filename: string): string {
    if (!filename.endsWith('.md')) {
      throw new Error(`Incorrect file type, expecting a markdown file but got: ${filename}`)
    }

    return filename.replace('.md', '')
  }

  static async createMovieObject(
    frontmatter: MovieFrontMatter,
    slug: string,
    abstract: string
  ): Promise<Movie> {
    const movie = new Movie()
    movie.title = frontmatter.title
    movie.summary = frontmatter.summary
    movie.slug = slug
    movie.abstract = abstract

    await cache.set(slug, movie)

    return movie
  }
}
