import type { HttpContext } from '@adonisjs/core/http'
import CineastService from '#services/cineast_service'

export default class DirectorsController {
  async list({ view }: HttpContext) {
    const directors = await CineastService.getCineastByRelation(
      'moviesDirected'
    ).orderBy([
      { column: 'firstName', order: 'asc' },
      { column: 'lastName', order: 'asc' },
    ])

    return await view.render('pages/directors/list', { directors })
  }

  async show({ view, params }: HttpContext) {
    const director = await CineastService.getCineastByProperty(
      'id',
      params.id as string
    )
    const movies = await director
      .related('moviesDirected')
      .query()
      .apply((scopes) => scopes.released())
      .orderBy('title')

    return await view.render('pages/directors/show', { director, movies })
  }
}
