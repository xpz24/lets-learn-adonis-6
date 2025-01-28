/* eslint-disable unicorn/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/require-await */
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'crew_movies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('cineast_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('cineasts')
        .onDelete('CASCADE')
      table
        .integer('movie_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('movies')
        .onDelete('CASCADE')

      table.string('title', 100).notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
