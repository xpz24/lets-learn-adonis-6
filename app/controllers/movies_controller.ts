import type { HttpContext } from '@adonisjs/core/http'
import MovieService from '#services/movie_service'

export default class MoviesController {
  async list({ view }: HttpContext) {
    const movies = await MovieService.getMovieList('resources/movies')
    return await view.render('pages/movies/list', { movies })
  }

  async show({ view, params }: HttpContext) {
    const movie = await MovieService.getMovie(params.slug as string)
    return await view.render('pages/movies/show', { movie })
  }
}
