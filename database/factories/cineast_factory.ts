/* eslint-disable @typescript-eslint/require-await */
import factory from '@adonisjs/lucid/factories'
import { MovieFactory } from '#database/factories/movie_factory'
import Cineast from '#models/cineast'

export const CineastFactory = factory
  .define(Cineast, async ({ faker }) => {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      headshotUrl: faker.image.avatar(),
    }
  })
  .relation('moviesDirected', () => MovieFactory)
  .relation('moviesWritten', () => MovieFactory)
  .build()
