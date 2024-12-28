import redis from '@adonisjs/redis/services/main'

class CacheService {
  async has(...keys: string[]) {
    return await redis.exists(keys)
  }

  async get(key: string) {
    const value = await redis.get(key)
    return value && (JSON.parse(value) as unknown)
  }

  async set(key: string, value: NonNullable<unknown>) {
    return await redis.set(key, JSON.stringify(value))
  }

  delete(...keys: string[]) {
    return redis.del(keys)
  }

  async flushDb() {
    return await redis.flushdb()
  }
}

const cache = new CacheService()
export default cache
