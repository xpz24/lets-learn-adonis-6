import factory from '@adonisjs/lucid/factories'
import { CineastFactory } from '#database/factories/cineast_factory'
import MovieStatuses from '#enums/movie_statuses'
import Movie from '#models/movie'
import { getRandomArrayItem } from '#utils/others'
import { DateTime } from 'luxon'

export const MovieFactory = factory
  // eslint-disable-next-line @typescript-eslint/require-await
  .define(Movie, async ({ faker }) => {
    function fakeReleaseDate(statusId: number) {
      switch (statusId) {
        case 1: {
          // return DateTime.fromJSDate(
          //   faker.date.future({ years: 5, refDate: '2030' })
          // )
          return null
        }
        case 2: {
          // return DateTime.fromJSDate(
          //   faker.date.future({ years: 4, refDate: '2029' })
          // )
          return null
        }
        case 3: {
          return DateTime.fromJSDate(
            faker.date.future({ years: 2, refDate: Date.now() })
          )
        }
        case 4: {
          return DateTime.fromJSDate(
            faker.date.soon({ days: 365, refDate: Date.now() })
          )
        }
        case 5: {
          return DateTime.fromJSDate(
            faker.date.past({ years: 50, refDate: Date.now() })
          )
        }
        // No default
      }

      return null
    }

    const statuses = Object.values(MovieStatuses).filter(
      (status) => typeof status === 'number'
    )

    const statusId = getRandomArrayItem(statuses)

    return {
      statusId,
      // writerId: faker.number.int({ min: 1, max: 10 }), // Handled by the relationship with CineastFactory
      // directorId: faker.number.int({ min: 11, max: 20 }), // Handled by the relationship with CineastFactory
      title: faker.book.title(),
      // slug: faker.lorem.slug(), //Should be taken care of by the createSlug() hook in Movie Model
      summary: faker.lorem.sentence(),
      abstract: faker.lorem.paragraphs(5),
      posterUrl: faker.image.urlPicsumPhotos({
        width: 300,
        height: 300,
        blur: 0,
      }),
      releasedAt: fakeReleaseDate(statusId),
    }
  })
  .relation('director', () => CineastFactory)
  .relation('writer', () => CineastFactory)
  .relation('castMembers', () => CineastFactory)
  .relation('crewMembers', () => CineastFactory)
  .build()
