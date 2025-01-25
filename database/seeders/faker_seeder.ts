/* eslint-disable unicorn/no-anonymous-default-export */
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { CineastFactory } from '#database/factories/cineast_factory'
import { MovieFactory } from '#database/factories/movie_factory'
import { UserFactory } from '#database/factories/user_factory'

export default class extends BaseSeeder {
  static environment = ['development', 'testing']

  async run() {
    await CineastFactory.createMany(30)
    await MovieFactory.createMany(30)
    await UserFactory.createMany(5)
  }
}
