import { Controller, Get, Param, Query } from "@nestjs/common"

import { getPaginationOptions } from "../../common/helpers/pagination.helper"
import { SurahGetAyahOptions, SurahGetOptions, SurahsService } from "../services/surahs.service"
import { Surah } from "../types/surah.type"

@Controller( "surahs" )
export class SurahsController {
  constructor( private readonly surahsService: SurahsService ) {}

  @Get( ":id" )
  get( @Param() params: { id: string }, @Query() query: { embed?: string } ): Promise<Surah> {
    const options: SurahGetOptions = {}

    if( query.embed ) {
      if( query.embed.includes( "ayahs" ) ) {
        options.embed_ayahs = true
      }

      if( query.embed.includes( "translations" ) ) {
        options.embed_ayahs = true
      }
    }

    return this.surahsService.get( params.id, options )
  }

  @Get( ":id/ayahs" )
  async getAyahs(
    @Param() params: {
      id: string
    },
    @Query() query: {
      page?: string
      per_page?: string
      translations?: string
      transliterations?: string
    }
  ) {
    const options: SurahGetAyahOptions = getPaginationOptions( query )

    if( query.translations ) {
      options.translations = query.translations.split( "," )
    }

    if( query.transliterations ) {
      options.transliterations = query.transliterations.split( "," )
    }

    return this.surahsService.getAyahs( params.id, options )
  }

  @Get()
  query(): Promise<Surah[]> {
    return this.surahsService.query()
  }
}
