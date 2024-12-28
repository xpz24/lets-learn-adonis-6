/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const RedisController = () => import('#controllers/redis_controller')
import router from '@adonisjs/core/services/router'
const MoviesController = () => import('#controllers/movies_controller')

const SLUG_REGEX = /^[\da-z]+(?:-[\da-z]+)*$/
router.on('/').render('pages/home').as('home')

router.get('/movies', [MoviesController, 'index']).as('movies.index')

router.get('/movies/:slug', [MoviesController, 'show']).as('movies.show').where('slug', SLUG_REGEX)

router.delete('redis/flush', [RedisController, 'flush']).as('redis.flush')

router
  .delete('/redis/:slug', [RedisController, 'destroy'])
  .as('redis.destroy')
  .where('slug', SLUG_REGEX)
