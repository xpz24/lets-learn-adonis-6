/* eslint-disable unicorn/no-anonymous-default-export */
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import MovieStatuses from '#enums/movie_statuses'
import Roles from '#enums/roles'
import MovieStatus from '#models/movie_status'
import Role from '#models/role'

export default class extends BaseSeeder {
  static environment = ['production', 'development', 'testing']

  async run() {
    await Role.createMany([
      {
        id: Roles.ADMIN,
        name: 'Admin',
      },
      {
        id: Roles.USER,
        name: 'User',
      },
    ])

    await MovieStatus.createMany([
      {
        id: MovieStatuses.WRITING,
        name: 'Writing',
      },
      {
        id: MovieStatuses.CASTING,
        name: 'Casting',
      },
      {
        id: MovieStatuses.PRODUCTION,
        name: 'Production',
      },
      {
        id: MovieStatuses.POST_PRODUCTION,
        name: 'Post Production',
      },
      {
        id: MovieStatuses.RELEASED,
        name: 'Released',
      },
    ])
  }
}
