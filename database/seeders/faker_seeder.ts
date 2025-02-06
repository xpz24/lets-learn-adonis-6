/* eslint-disable unicorn/no-anonymous-default-export */
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { faker as customFaker } from '@faker-js/faker'
import type { FakeMovieData } from '@typings/movie'
import { CineastFactory } from '#database/factories/cineast_factory'
import { MovieFactory } from '#database/factories/movie_factory'
import { UserFactory } from '#database/factories/user_factory'
import { movies } from '#database/fake_data/movies'
import MovieStatuses from '#enums/movie_statuses'
import type Cineast from '#models/cineast'
import { getRandomArrayItem, getShuffledSplicedArray } from '#utils/others'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  static environment = ['development', 'testing']

  async run() {
    const cineast = await CineastFactory.createMany(5000)
    await UserFactory.with('profile').createMany(5)
    await this.#createMovies(movies, cineast, 30)
  }

  #pivotData(
    cineastInstances: Cineast[],
    PivotColumns: Record<string, unknown>
  ) {
    return Object.fromEntries(
      getShuffledSplicedArray(cineastInstances).map((cineastInstance) => [
        cineastInstance.id,
        PivotColumns,
      ])
    )
  }

  async #createMovies(
    listOfMovies: FakeMovieData[],
    cineast: Cineast[],
    quantityFromFactory: number
  ) {
    const castMoviesColumns = {
      character_name: customFaker.person.fullName(),
      sort_order: customFaker.number.int({ min: 0, max: 10 }),
    }

    const crewMoviesColumns = {
      title: customFaker.person.jobTitle(),
      sort_order: customFaker.number.int({ min: 0, max: 10 }),
    }

    for (const movie of listOfMovies) {
      const shuffledSplicedCast = this.#pivotData(cineast, castMoviesColumns)
      const shuffledSplicedCrew = this.#pivotData(cineast, crewMoviesColumns)

      const movieInstance = await MovieFactory.tap((row, { faker }) => {
        const releasedYear = movie.releaseYear

        row.statusId = MovieStatuses.RELEASED
        row.writerId = getRandomArrayItem(cineast).id
        row.directorId = getRandomArrayItem(cineast).id
        row.title = movie.title
        row.releasedAt = DateTime.fromJSDate(
          faker.date.between({
            from: `${releasedYear.toString()}-01-01`,
            to: `${releasedYear.toString()}-12-31`,
          })
        )
      }).create()

      await movieInstance.related('castMembers').attach(shuffledSplicedCast)
      await movieInstance.related('crewMembers').attach(shuffledSplicedCrew)
    }

    for (let index = 0; index < quantityFromFactory; index++) {
      const shuffledSplicedCast = this.#pivotData(cineast, castMoviesColumns)
      const shuffledSplicedCrew = this.#pivotData(cineast, crewMoviesColumns)

      const movieInstance = await MovieFactory.tap((row) => {
        row.writerId = getRandomArrayItem(cineast).id
        row.directorId = getRandomArrayItem(cineast).id
      }).create()

      await movieInstance.related('castMembers').attach(shuffledSplicedCast)
      await movieInstance.related('crewMembers').attach(shuffledSplicedCrew)
    }
  }
}
