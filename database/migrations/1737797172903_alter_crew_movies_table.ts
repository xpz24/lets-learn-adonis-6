/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable unicorn/no-anonymous-default-export */
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'crew_movies'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('sort_order').notNullable().defaultTo(0)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('sort_order')
    })
  }
}
