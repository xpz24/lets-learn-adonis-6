import type { BaseModel } from '@adonisjs/lucid/orm'
import type { LucidModel, LucidRow } from '@adonisjs/lucid/types/model'
import type { ExtractModelRelations } from '@adonisjs/lucid/types/relations'

// ? is Exclude or Extract better? I think Exclude cause if this
// ? type definition works as expected only strings will be left
export type ModelColumns<T extends LucidModel> = Exclude<
  {
    [K in keyof InstanceType<T>]: InstanceType<T>[K] extends (
      ...arguments_: unknown[]
    ) => unknown
      ? never
      : K extends keyof InstanceType<typeof BaseModel>
        ? never
        : K
  }[keyof InstanceType<T>],
  undefined
>

export interface OrderBy<T extends LucidModel> {
  column: ModelColumns<T>
  order?: 'asc' | 'desc'
  nulls?: 'first' | 'last'
}

export type ModelRelations<T extends LucidRow> = Exclude<
  ExtractModelRelations<T>,
  undefined
>
