import { Module } from "@nestjs/common"
import { ServeStaticModule } from "@nestjs/serve-static"
import * as path from "path"

import { CommonModule } from "../common/common.module"
import { SurahsController } from "./controllers/surahs.controller"
import { MongoModule } from "../mongo/mongo.module"
import { AyahsRepository } from "./repositories/ayahs.repository"
import { SurahsRepository } from "./repositories/surahs.repository"
import { SurahsService } from "./services/surahs.service"

@Module( {
  controllers: [
    SurahsController,
  ],
  imports: [
    CommonModule,
    MongoModule.forRoot(),
    ServeStaticModule.forRoot( {
      rootPath: path.join( __dirname, '../../../../', 'src/quran/build' ),
      serveStaticOptions: {
        extensions: [ "html" ],
        redirect: false,
      }
    } ),
  ],
  providers: [
    AyahsRepository,
    SurahsRepository,
    SurahsService,
  ],
} )
export class QuranModule {
}