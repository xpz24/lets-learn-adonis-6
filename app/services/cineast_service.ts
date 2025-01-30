/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable unicorn/no-static-only-class */
/* eslint-disable @typescript-eslint/no-extraneous-class */
// import type { MovieScopeFunction } from '@typings/movie'
// import type {
//   ExtractModelRelations,
//   RelationSubQueryBuilderContract,
// } from '@adonisjs/lucid/types/relations'
import { CineastRelationKey } from '@typings/cineast'
import { ModelColumns } from '@typings/model'
import type { MovieScopeFunction } from '@typings/movie'
import Cineast from '#models/cineast'
import type Movie from '#models/movie'

export default class CineastService {
  // This implementation should provide a way to get all cineast with a relation
  // Optionally limited by a scope, note: This function only returns a query builder
  // Also adds the count of released and unreleased movies they are involved in
  static getCineastByRelation(
    relationship: CineastRelationKey,
    limitByScopeFunction?: MovieScopeFunction
  ) {
    const cineastQuery = Cineast.query()
    if (limitByScopeFunction) {
      void cineastQuery.whereHas(relationship, (query) =>
        query.apply(limitByScopeFunction)
      )
    } else {
      void cineastQuery.has(relationship)
    }

    return cineastQuery
      .withCount(relationship, (query) =>
        query.apply((scopes) => scopes.released()).as('releasedCount')
      )
      .withCount(relationship, (query) =>
        query.apply((scopes) => scopes.unReleased()).as('unReleasedCount')
      )

    // return (
    //   Cineast.query()
    //     // Use has instead of whereHas to get all without filtered by a scope
    //     // Then conditionally use whereHas if there is an extra argument
    //     .whereHas(relationship, (query) =>
    //       query.apply((scopes) => scopes.released())
    //     )
    //     .withCount(relationship, (query) =>
    //       query.apply((scopes) => scopes.released()).as('releasedCount')
    //     )
    //     .withCount(relationship, (query) =>
    //       query.apply((scopes) => scopes.unReleased()).as('unReleasedCount')
    //     )
    // )
    // Add additional scopes for actors and other crew members
  }

  // Main difference from above is the relationship is only used to preload movies to the model instance
  // Main use case is just getting a cineast/s via properties aka column
  static getCineastByProperty(
    property: string,
    value: string,
    preloadOptions?: {
      relationship: CineastRelationKey
      orderBy: {
        column: ModelColumns<typeof Movie>
        direction?: 'asc' | 'desc'
      }
      movieScope?: MovieScopeFunction
    }
  ) {
    const cineast = Cineast.query().where(property, value)
    if (preloadOptions) {
      void cineast.preload(preloadOptions.relationship, (query) =>
        query
          .apply(
            preloadOptions.movieScope ??
              (() => {
                // No-Op, just to make the linter happy, could have used a conditional if statement instead
              })
          )
          .orderBy(
            preloadOptions.orderBy.column as string,
            preloadOptions.orderBy.direction
          )
      )
    }

    return cineast.firstOrFail()
  }
  // directors: await Cineast.query().whereHas(
  //   'moviesDirected',
  //   async (query) => await query.apply(async (scopes) => await scopes.released())
  // ),
}
