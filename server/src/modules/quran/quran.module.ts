import { Module } from "@nestjs/common"
import { ServeStaticModule } from "@nestjs/serve-static"
import * as path from "path"

import { CommonModule } from "../common/common.module"
import { MongoModule } from "../mongo/mongo.module"
import { JuzController } from "./controllers/juz.controller"
import { SurahController } from "./controllers/surah.controller"
import { TranslatorController } from "./controllers/translator.controller"
import { AyahsRepository } from "./repositories/ayahs.repository"
import { JuzsRepository } from "./repositories/juzs.repository"
import { SurahsRepository } from "./repositories/surahs.repository"
import { TranslationsRepository } from "./repositories/translations.repository"
import { TranslatorsRepository } from "./repositories/translators.repository"
import { JuzService } from "./services/juz.service"
import { SurahService } from "./services/surah.service"
import { TranslatorService } from "./services/translators.service"

@Module( {
  controllers: [
    JuzController,
    SurahController,
    TranslatorController,
  ],
  imports: [
    CommonModule,
    MongoModule.forRoot(),
    ServeStaticModule.forRoot( {
      rootPath: path.join( __dirname, "../../../../", "src/quran/build" ),
      serveStaticOptions: {
        extensions: [ "html" ],
        redirect: false,
      },
    } ),
  ],
  providers: [
    AyahsRepository,
    JuzsRepository,
    JuzService,
    SurahsRepository,
    SurahService,
    TranslatorService,
    TranslationsRepository,
    TranslatorsRepository,
  ],
} )
export class QuranModule {
}
