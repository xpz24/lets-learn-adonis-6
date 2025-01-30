import type { HttpContext } from '@adonisjs/core/http'
import CineastService from '#services/cineast_service'

export default class WritersController {
  async list({ view }: HttpContext) {
    const writers = await CineastService.getCineastByRelation(
      'moviesWritten'
    ).orderBy([
      { column: 'firstName', order: 'asc' },
      { column: 'lastName', order: 'asc' },
    ])

    return await view.render('pages/writers/list', { writers })
  }

  async show({ view, params }: HttpContext) {
    const writer = await CineastService.getCineastByProperty(
      'id',
      params.id as string,
      {
        relationship: 'moviesWritten',
        orderBy: { column: 'title', direction: 'asc' },
        movieScope: (scopes) => scopes.released(),
      }
    )

    // .related('moviesWritten')
    // .query()
    // .apply((scopes) => scopes.released())
    // .orderBy('title')

    return await view.render('pages/writers/show', { writer })
  }
}
