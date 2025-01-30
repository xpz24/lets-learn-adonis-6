import type { BaseModel } from '@adonisjs/lucid/orm'
import type { LucidModel } from '@adonisjs/lucid/types/model'

export type ModelColumns<T extends LucidModel> = {
  [K in keyof InstanceType<T>]: InstanceType<T>[K] extends (
    ...arguments_: unknown[]
  ) => unknown
    ? never
    : K extends keyof InstanceType<typeof BaseModel>
      ? never
      : K
}[keyof InstanceType<T>]

interface OrderBy<T extends LucidModel> {
  column: ModelColumns<T>
  order?: 'asc' | 'desc'
  nulls?: 'first' | 'last'
}

export type OrderByArray<T extends LucidModel> = OrderBy<T>[]
