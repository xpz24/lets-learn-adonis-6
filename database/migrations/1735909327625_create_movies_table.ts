/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable unicorn/no-anonymous-default-export */
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'movies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('status_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('movie_statuses')
      table
        .integer('writer_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('cineasts')
      table
        .integer('director_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('cineasts')

      table.string('title', 100).notNullable()
      table.string('slug', 200).notNullable().unique()
      table.string('summary', 255).notNullable()
      table.text('abstract')
      table.string('poster_url', 255).nullable()
      table.timestamp('released_at').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
