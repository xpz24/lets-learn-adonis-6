import fs from 'node:fs/promises'
import markToHtml from '#utils/markdown_to_html'
import app from '@adonisjs/core/services/app'
import customErrorHandler from '#utils/error_helper'
import Movie from '#models/movie'
import type { MovieFrontMatter } from '#types/movie'
import cache from '#services/cache_service'
import { verifyObjectType } from '#utils/others'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class MovieService {
  static #keysOfFrontmatter: (keyof MovieFrontMatter)[] = ['title', 'summary']
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
      console.log(`Cache hit: ${slug}`)
      return cachedMovie
    }
    const url = app.makeURL(`resources/movies/${slug}.md`)
    const { frontmatter, html } = await markToHtml<MovieFrontMatter>(url, {
      frontmatterKeys: this.#keysOfFrontmatter,
    })

    return await Movie.createMovieObject(frontmatter, slug, html)
  }
}
