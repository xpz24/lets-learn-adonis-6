/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable unicorn/no-anonymous-default-export */
import { BaseSchema } from '@adonisjs/lucid/schema'
import Roles from '#enums/roles'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('role_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('roles')
        .defaultTo(Roles.USER)

      table.string('full_name').nullable()
      table.string('avatar_url', 255).nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
