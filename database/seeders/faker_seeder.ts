/* eslint-disable unicorn/no-anonymous-default-export */
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import type { FakeMovieData } from '@typings/movie'
import { CineastFactory } from '#database/factories/cineast_factory'
import { MovieFactory } from '#database/factories/movie_factory'
import { UserFactory } from '#database/factories/user_factory'
import { movies } from '#database/fake_data/movies'
import MovieStatuses from '#enums/movie_statuses'
import type Cineast from '#models/cineast'
import { getRandomArrayItem } from '#utils/others'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  static environment = ['development', 'testing']

  async run() {
    const cineast = await CineastFactory.createMany(300)
    await UserFactory.with('profile').createMany(5)
    await this.#createMovies(movies, cineast, 30)
  }

  async #createMovies(
    listOfMovies: FakeMovieData[],
    cineast: Cineast[],
    quantityFromFactory: number
  ) {
    for (const movie of listOfMovies) {
      await MovieFactory.tap((row, { faker }) => {
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
    }
    for (let index = 0; index < quantityFromFactory; index++) {
      await MovieFactory.tap((row) => {
        row.writerId = getRandomArrayItem(cineast).id
        row.directorId = getRandomArrayItem(cineast).id
      }).create()
    }
  }
}
