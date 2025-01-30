import type { HttpContext } from '@adonisjs/core/http'
import cineastService from '#services/cineast_service'

export default class WritersController {
  async list({ view }: HttpContext) {
    const writers = await cineastService
      .getCineastByRelation('moviesWritten')
      .orderBy([
        { column: 'firstName', order: 'asc' },
        { column: 'lastName', order: 'asc' },
      ])

    return await view.render('pages/writers/list', { writers })
  }

  async show({ view, params }: HttpContext) {
    const writer = await cineastService.getCineastByProperty(
      'id',
      params.id as string,
      {
        relationship: 'moviesWritten',
        orderBy: [{ column: 'title', order: 'desc' }],
        movieScope: (scopes) => scopes.released(),
      }
    )

    return await view.render('pages/writers/show', { writer })
  }
}
