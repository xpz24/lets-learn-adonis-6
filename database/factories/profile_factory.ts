/* eslint-disable @typescript-eslint/require-await */
import factory from '@adonisjs/lucid/factories'
import Roles from '#enums/roles'
import Profile from '#models/profile'

let adminFlag = true

export const ProfileFactory = factory
  .define(Profile, async ({ faker }) => {
    if (adminFlag) {
      adminFlag = false

      return {
        userId: Roles.ADMIN,
        bio: 'I am the admin, supreme overload of this website',
      }
    } else {
      return {
        userId: Roles.USER,
        bio: faker.lorem.paragraph(),
      }
    }
  })
  .build()
