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
