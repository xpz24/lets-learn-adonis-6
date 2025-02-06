export function throwErrorIfUndefined(
  value: unknown,
  errorMessage = 'Is Null/Undefined'
): asserts value is NonNullable<typeof value> {
  if (value === undefined) {
    throw new Error(errorMessage)
  }
}

export function verifyObjectType<T>(
  object: unknown,
  keys: (keyof T)[]
): asserts object is T {
  if (
    typeof object !== 'object' ||
    object === null ||
    Object.keys(object).length !== keys.length || // Check for exact keys
    keys.some((key) => !(key in object) || (object as T)[key] === 'undefined') // Validate key presence
  ) {
    throw new Error(`Object does not match the expected structure`)
  }
}

export function deepMerge(...objects: Record<string, unknown>[]) {
  // eslint-disable-next-line unicorn/no-array-reduce
  return objects.reduce((mergedObject, currentObject) => {
    for (const [key, value] of Object.entries(currentObject)) {
      mergedObject[key] =
        value &&
        typeof value === 'object' &&
        Object.prototype.toString.call(value) === '[object Object]' &&
        mergedObject[key] &&
        typeof mergedObject[key] === 'object' &&
        Object.prototype.toString.call(mergedObject[key]) === '[object Object]'
          ? deepMerge(
              mergedObject[key] as Record<string, unknown>,
              value as Record<string, unknown>
            )
          : value
    }
    return mergedObject
  })
}

export function getRandomArrayItem<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)]
}

export function getShuffledSplicedArray<T>(array: T[], max = 200, min = 50) {
  if (max < min || min > array.length || max > array.length) {
    throw new Error('Max & Min out of bounds')
  }
  const shuffled = array.toSorted(() => 0.5 - Math.random())
  const count = Math.floor(Math.random() * (max - min + 1)) + min
  return shuffled.splice(
    Math.floor(Math.random() * shuffled.length) - count + 1,
    count
  )
}
