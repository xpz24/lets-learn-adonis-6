import router from '@adonisjs/core/services/router'

const WritersController = () => import('#controllers/writers_controller')
const DirectorsController = () => import('#controllers/directors_controller')
const RedisController = () => import('#controllers/redis_controller')
const MoviesController = () => import('#controllers/movies_controller')

/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const SLUG_REGEX = /^[\da-z]+(?:-[\da-z]+)*$/
router.on('/').render('pages/home').as('home')

router.get('/movies', [MoviesController, 'list']).as('movies.list')
router
  .get('/movies/:slug', [MoviesController, 'show'])
  .as('movies.show')
  .where('slug', SLUG_REGEX)

router.get('/directors', [DirectorsController, 'list']).as('directors.list')
router.get('/directors/:id', [DirectorsController, 'show']).as('directors.show')

router.get('/writers', [WritersController, 'list']).as('writers.list')
router.get('/writers/:id', [WritersController, 'show']).as('writers.show')

router.delete('redis/flush', [RedisController, 'flush']).as('redis.flush')
router
  .delete('/redis/:slug', [RedisController, 'destroy'])
  .as('redis.destroy')
  .where('slug', SLUG_REGEX)
