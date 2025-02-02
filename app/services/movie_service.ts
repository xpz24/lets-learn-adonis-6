import { Exception } from '@adonisjs/core/exceptions'
import type { GetMovieOptions, GetMoviesOptions } from '@typings/movie'
import Movie from '#models/movie'

const movieService = {
  getMovies(options?: GetMoviesOptions) {
    const movieQuery = Movie.query()

    if (options) {
      if (options.scopeFunctionArray) {
        for (const scopeFunction of options.scopeFunctionArray) {
          void movieQuery.apply(scopeFunction)
        }
      }

      if (options.preloadArray) {
        for (const preload of options.preloadArray) {
          void movieQuery.preload(preload)
        }
      }

      if (options.whereNotNullArray) {
        for (const notNullColumn of options.whereNotNullArray)
          void movieQuery.whereNotNull(notNullColumn)
      }

      if (options.orderByArray) {
        void movieQuery.orderBy(options.orderByArray)
      }

      if (options.limit) {
        void movieQuery.limit(options.limit)
      }
    }

    return movieQuery
  },

  async getMovie(options?: GetMovieOptions) {
    if (options) {
      const movie = Movie.query().where(options.property, options.value)
      if (options.preloadArray) {
        for (const preload of options.preloadArray) {
          void movie.preload(preload)
        }
      }

      return await movie.firstOrFail()
    }

    // ? might be better to have genre scopes when randomizing?
    // ? logic could be better?
    // TODO: Do additional research
    const count = await Movie.query().count('id as total')
    const total = count[0].$extras.total
      ? (count[0].$extras.total as number)
      : 0

    if (total) {
      const randomOffset = Math.floor(Math.random() * total)
      return await Movie.query().offset(randomOffset).firstOrFail()
    } else {
      throw new Exception('Table has a count of zero')
    }
  },
}

export default movieService
