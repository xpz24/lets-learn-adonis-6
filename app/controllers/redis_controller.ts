import cache from '#services/cache_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class RedisController {
  public async destroy({ response, params }: HttpContext) {
    await cache.delete(params.slug as string)
    response.redirect().back()
  }
  public async flush({ response }: HttpContext) {
    await cache.flushDb()
    response.redirect().back()
  }
}
