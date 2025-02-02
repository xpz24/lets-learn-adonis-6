import type { HttpContext } from '@adonisjs/core/http'
import cineastService from '#services/cineast_service'

export default class DirectorsController {
  async list({ view }: HttpContext) {
    const directors = await cineastService.getCineasts({
      relationship: 'moviesDirected',
      hasScopeArray: [(scopes) => scopes.released()],
      countObject: {
        releasedCount: (scopes) => scopes.released(),
        unReleasedCount: (scopes) => scopes.unReleased(),
      },
      orderByArray: [{ column: 'firstName' }, { column: 'lastName' }],
    })

    return await view.render('pages/directors/list', { directors })
  }

  async show({ view, params }: HttpContext) {
    const director = await cineastService.getCineast({
      property: 'id',
      value: params.id as string,
      preloadOptions: {
        cineastRelationArray: ['moviesDirected', 'moviesWritten'],
        movieRelationArray: ['director', 'writer'],
        orderByArray: [{ column: 'title' }],
        movieScopeArray: [(scopes) => scopes.released()],
      },
    })

    return await view.render('pages/directors/show', { director })
  }
}
