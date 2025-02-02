import type { HttpContext } from '@adonisjs/core/http'
import movieService from '#services/movie_service'

export default class MoviesController {
  async list({ view }: HttpContext) {
    const recentlyReleased = await movieService.getMovies({
      limit: 10,
      preloadArray: ['director', 'writer'],
      scopeFunctionArray: [(scopes) => scopes.released()],
      orderByArray: [
        { column: 'releasedAt', order: 'desc' },
        { column: 'title', order: 'asc' },
      ],
    })

    const releasingSoon = await movieService.getMovies({
      limit: 10,
      preloadArray: ['director', 'writer'],
      scopeFunctionArray: [(scopes) => scopes.unReleased()],
      orderByArray: [
        { column: 'releasedAt', order: 'asc' },
        { column: 'title', order: 'asc' },
      ],
      whereNotNullArray: ['releasedAt'],
    })

    return await view.render('pages/movies/list', {
      recentlyReleased,
      releasingSoon,
    })
  }

  async show({ view, params }: HttpContext) {
    const movie = await movieService.getMovie({
      property: 'slug',
      value: params.slug as string,
      preloadArray: ['director', 'writer'],
    })
    return await view.render('pages/movies/show', { movie })
  }
}
