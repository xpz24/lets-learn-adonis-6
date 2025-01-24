import app from '@adonisjs/core/services/app'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class IndexSeeder extends BaseSeeder {
  private async seed(Seeder: { default: typeof BaseSeeder }) {
    // console.log('Seeder.default.environment', Seeder.default.environment)
    // console.log('app.inDev', app.inDev)
    // console.log('app.inTest', app.inTest)
    // console.log('app.inProduction', app.inProduction)
    /**
     * Do not run when not in a environment specified in Seeder
     */
    if (
      (!Seeder.default.environment.includes('development') && app.inDev) ||
      (!Seeder.default.environment.includes('testing') && app.inTest) ||
      (!Seeder.default.environment.includes('production') && app.inProduction)
    ) {
      return
    }

    await new Seeder.default(this.client).run()
  }

  async run() {
    // await this.seed(await import('#database/seeders/category'))
    // await this.seed(await import('#database/seeders/user'))
    // await this.seed(await import('#database/seeders/post'))
    await this.seed(await import('#database/seeders/start_seeder'))
    await this.seed(await import('#database/seeders/faker_seeder'))
  }
}
