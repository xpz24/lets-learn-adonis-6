/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable unicorn/no-anonymous-default-export */
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'movies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('status_id').unsigned().references('id').inTable('movie_statuses').notNullable()
      table.integer('writer_id').unsigned().references('id').inTable('cineasts').notNullable()
      table.integer('director_id').unsigned().references('id').inTable('cineasts').notNullable()
      table.string('title', 100).notNullable()
      table.string('slug', 200).notNullable().unique()
      table.string('summary', 255).notNullable().defaultTo('')
      table.text('abstract')
      table.string('poster_url', 255).notNullable().defaultTo('')
      table.timestamp('released_at').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
