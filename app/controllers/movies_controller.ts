import type { HttpContext } from '@adonisjs/core/http'
import MovieService from '#services/movie_service'

export default class MoviesController {
  async list({ view }: HttpContext) {
    const movies = await MovieService.movieList
    const recentlyReleased = await MovieService.recentlyReleased
    const releasingSoon = await MovieService.releasingSoon

    // Format the dates
    // for (const movie of movies) {
    // movies[0].releasedAt?.toFormat('yyyy-MM-dd')
    // }
    // for (const movie of recentlyReleased) {
    //   movie.releasedAtFormatted = DateTime.fromISO(
    //     movie.releasedAt
    //   ).toLocaleString(DateTime.DATE_MED)
    // }
    // for (const movie of releasingSoon) {
    //   movie.releasedAtFormatted = DateTime.fromISO(
    //     movie.releasedAt
    //   ).toLocaleString(DateTime.DATE_MED)
    // }

    return await view.render('pages/movies/list', {
      recentlyReleased,
      releasingSoon,
      movies,
    })
  }

  async show({ view, params }: HttpContext) {
    const movie = await MovieService.getMovie('slug', params.slug as string)
    return await view.render('pages/movies/show', { movie })
  }
}
