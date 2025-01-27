import factory from '@adonisjs/lucid/factories'
import { ProfileFactory } from '#database/factories/profile_factory'
import Roles from '#enums/roles'
import User from '#models/user'

let adminFlag = true

export const UserFactory = factory
  // eslint-disable-next-line @typescript-eslint/require-await
  .define(User, async ({ faker }) => {
    const admin = {
      roleId: Roles.ADMIN,
      fullName: 'xpz24',
      avatarUrl: faker.image.avatar(),
      email: faker.internet.email(),
      password: 'helloworld',
    }

    const user = {
      roleId: Roles.USER,
      fullName: faker.person.fullName(),
      avatarUrl: faker.image.avatar(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }

    if (adminFlag) {
      adminFlag = false
      return admin
    } else {
      return user
    }
  })
  .relation('profile', () => ProfileFactory)
  .build()
