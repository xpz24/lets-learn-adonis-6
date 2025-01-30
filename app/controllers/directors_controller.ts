import type { HttpContext } from '@adonisjs/core/http'
import cineastService from '#services/cineast_service'

export default class DirectorsController {
  async list({ view }: HttpContext) {
    const directors = await cineastService
      .getCineastByRelation('moviesDirected')
      .orderBy([
        { column: 'firstName', order: 'asc' },
        { column: 'lastName', order: 'asc' },
      ])

    return await view.render('pages/directors/list', { directors })
  }

  async show({ view, params }: HttpContext) {
    const director = await cineastService.getCineastByProperty(
      'id',
      params.id as string,
      {
        relationship: 'moviesDirected',
        orderBy: [{ column: 'title', order: 'asc' }],
        movieScope: (scopes) => scopes.released(),
      }
    )

    return await view.render('pages/directors/show', { director })
  }
}
