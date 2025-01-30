import { CineastRelationKey } from '@typings/cineast'
import type { OrderByArray } from '@typings/model'
import type { MovieScopeFunction } from '@typings/movie'
import Cineast from '#models/cineast'
import type Movie from '#models/movie'

// ? Can these methods be made reactive in the frontend? htmx or alpine
const cineastService = {
  // ? Should this be a class or a plain object? if only static methods why not a plain object?
  // * This implementation should provide a way to get all cineast instances with a relation
  // ! Relations can be mapped to its type interface, check CineastRelationKey
  // * Optionally limited by a scope, note: This function only returns a query builder
  // * Also adds the count of released and unreleased movies they are involved in
  getCineastByRelation(
    relationship: CineastRelationKey,
    limitByScopeFunction?: MovieScopeFunction
  ) {
    const cineastQuery = Cineast.query()
    if (limitByScopeFunction) {
      void cineastQuery.whereHas(
        relationship,
        (query) => void query.apply(limitByScopeFunction)
      )
    } else {
      void cineastQuery.has(relationship)
    }

    return cineastQuery
      .withCount(
        relationship,
        (query) =>
          void query.apply((scopes) => scopes.released()).as('releasedCount')
      )
      .withCount(
        relationship,
        (query) =>
          void query
            .apply((scopes) => scopes.unReleased())
            .as('unReleasedCount')
      )

    // ? Do we really need scopes for other models? more relations need to be mapped for other crew members?
  },

  // * Main difference from above is the relationship is optionally used to preload movies to the model instance
  // * Main use case is just getting a cineast via properties aka column, singular due to firstOrFail()
  // * If no movieScope is given all the movies under that cineast will be preloaded
  // * If no direction is given sorting order will be ORM defaults
  getCineastByProperty(
    property: string,
    value: string,
    preloadOptions?: {
      relationship: CineastRelationKey
      orderBy: OrderByArray<typeof Movie>
      movieScope?: MovieScopeFunction
    }
  ) {
    const cineast = Cineast.query().where(property, value)
    if (preloadOptions) {
      void cineast.preload(
        preloadOptions.relationship,
        (query) =>
          void query
            .apply(
              preloadOptions.movieScope ??
                (() => {
                  // ? No-Op, just to make the linter happy, could have used a conditional if statement instead
                })
            )
            // * This orders the preloaded movie instances
            .orderBy(preloadOptions.orderBy as { column: string }[])
      )
    }

    return cineast.firstOrFail()
  },
}

export default cineastService
