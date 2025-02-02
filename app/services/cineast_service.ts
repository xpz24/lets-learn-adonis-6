import {
  type GetCineastOptions,
  type GetCineastsOptions,
} from '@typings/cineast'
import Cineast from '#models/cineast'

// ? Can these methods be made reactive in the frontend? htmx or alpine
const cineastService = {
  // * This implementation should provide a way to get all cineast instances with a relation
  // ! Relations need to be explicitly checked for callbacks
  // * Optionally limited by a scope/s, note: This function only returns a query builder
  // * Also adds counts using countArray, which is the same as scopeArray
  getCineasts(options: GetCineastsOptions) {
    const cineastQuery = Cineast.query()
    if (options.relationship) {
      if (options.hasScopeArray) {
        const scopeArray = options.hasScopeArray
        void cineastQuery.whereHas(options.relationship, (query) => {
          for (const scope of scopeArray) {
            void query.apply(scope)
          }
        })
      } else {
        void cineastQuery.has(options.relationship)
      }

      if (options.countObject) {
        const countObject = options.countObject
        for (const [name, scope] of Object.entries(countObject)) {
          void cineastQuery.withCount(options.relationship, (query) => {
            void query.apply(scope).as(name)
          })
        }
      }

      if (options.orderByArray) {
        void cineastQuery.orderBy(options.orderByArray)
      }

      return cineastQuery
    }
  },

  // * Main use case is just getting a cineast via properties
  // * If no movieScope is given all the movies under that cineast will be preloaded
  // TODO: if no arguments are provided, will get a random cineast
  getCineast(options: GetCineastOptions) {
    const cineastQuery = Cineast.query().where(options.property, options.value)
    if (options.preloadOptions?.cineastRelationArray) {
      for (const relationship of options.preloadOptions.cineastRelationArray) {
        // ! Explicitly checking for relationship is required if you wish to get proper type for callback
        if (relationship) {
          void cineastQuery.preload(relationship, (query) => {
            if (options.preloadOptions?.movieScopeArray) {
              for (const scope of options.preloadOptions.movieScopeArray) {
                void query.apply(scope)
              }
              for (const relation of options.preloadOptions
                .movieRelationArray) {
                void query.preload(relation)
              }
              // * This orders the preloaded movie instances
              void query.orderBy(options.preloadOptions.orderByArray)
            }
          })
        }
      }
    }

    return cineastQuery.firstOrFail()
  },
}

export default cineastService
