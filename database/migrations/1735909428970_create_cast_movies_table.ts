/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable unicorn/no-anonymous-default-export */
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cast_movies'

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

      table.string('character_name', 200).notNullable()
      table.integer('sort_order').notNullable().defaultTo(0)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
