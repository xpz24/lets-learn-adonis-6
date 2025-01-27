// import fs from 'node:fs/promises'
// import app from '@adonisjs/core/services/app'
// import type { MovieFrontMatter } from '@typings/movie'
import Movie from '#models/movie'

// import cache from '#services/cache_service'
// import customErrorHandler from '#utils/error_helper'
// import markToHtml from '#utils/markdown_to_html'
// import { verifyObjectType } from '#utils/others'

// eslint-disable-next-line unicorn/no-static-only-class, @typescript-eslint/no-extraneous-class
export default class MovieService {
  static movieList = Movie.all()

  static recentlyReleased = Movie.query()
    .withScopes((scope) => scope.released())
    .orderBy('releasedAt', 'desc')
    .limit(15)

  static releasingSoon = Movie.query()
    .withScopes((scope) => scope.unReleased())
    .whereNotNull('releasedAt')
    .orderBy('releasedAt', 'desc')
    .limit(10)

  static async getMovie(property: string, value: string) {
    return await Movie.findByOrFail(property, value)
  }
  /*static #keysOfFrontmatter: (keyof MovieFrontMatter)[] = ['title', 'summary']
  static #keysOfMovie: (keyof Movie)[] = [...this.#keysOfFrontmatter, 'slug', 'abstract']

  static async getMovieList(moviesResourceDirectory: string): Promise<Movie[]> {
    const url = app.makeURL(moviesResourceDirectory)

    try {
      const files = await fs.readdir(url)

      return await Promise.all(
        files.map((filename) => this.parseMovieFile(Movie.getSlug(filename)))
      )
    } catch (error) {
      customErrorHandler(error, `Could not find the directory: ${moviesResourceDirectory}`)
    }
  }

  static async getMovie(slug: string) {
    try {
      return await this.parseMovieFile(slug)
    } catch (error) {
      customErrorHandler(error, `Could not find a movie called ${slug}`)
    }
  }

  private static async parseMovieFile(slug: string): Promise<Movie> {
    if (await cache.has(slug)) {
      const cachedMovie = await cache.get(slug)
      verifyObjectType<Movie>(cachedMovie, this.#keysOfMovie)
      // console.log(`Cache hit: ${slug}`)
      return cachedMovie
    }
    const url = app.makeURL(`resources/movies/${slug}.md`)
    const { frontmatter, html } = await markToHtml<MovieFrontMatter>(url, {
      frontmatterKeys: this.#keysOfFrontmatter,
    })

    return await Movie.createMovieObject(frontmatter, slug, html)
  }*/
}
