import factory from '@adonisjs/lucid/factories'
import MovieStatuses from '#enums/movie_statuses'
import Movie from '#models/movie'
import { DateTime } from 'luxon'

export const MovieFactory = factory
  // eslint-disable-next-line @typescript-eslint/require-await
  .define(Movie, async ({ faker }) => {
    function fakeReleaseDate(statusId: number) {
      switch (statusId) {
        case 1: {
          return DateTime.fromJSDate(faker.date.future({ years: 5, refDate: '2030' }))
        }
        case 2: {
          return DateTime.fromJSDate(faker.date.future({ years: 4, refDate: '2029' }))
        }
        case 3: {
          return DateTime.fromJSDate(faker.date.future({ years: 3, refDate: '2025' }))
        }
        case 4: {
          return DateTime.fromJSDate(faker.date.future({ years: 2, refDate: '2024' }))
        }
        case 5: {
          return DateTime.fromJSDate(faker.date.past({ years: 50, refDate: '2025' }))
        }
        // No default
      }

      return null
    }

    const statuses = Object.values(MovieStatuses).filter((status) => typeof status === 'number')

    const statusId = statuses[Math.floor(Math.random() * statuses.length)]

    return {
      statusId,
      writerId: faker.number.int({ min: 1, max: 10 }),
      directorId: faker.number.int({ min: 11, max: 20 }),
      title: faker.book.title(),
      slug: faker.lorem.slug(),
      summary: faker.lorem.sentence(),
      abstract: faker.lorem.paragraphs(5),
      posterUrl: faker.image.urlPicsumPhotos({ width: 300, height: 300, blur: 0 }),
      releasedAt: fakeReleaseDate(statusId),
    }
  })
  .build()
