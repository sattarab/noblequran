import { Controller, Get, Param, Query } from "@nestjs/common"

import { getPaginationOptions } from "../../common/helpers/pagination.helper"
import { SurahGetAyahOptions, SurahGetOptions, SurahService } from "../services/surah.service"
import { Surah } from "../types/surah.type"

@Controller( "surahs" )
export class SurahController {
  constructor( private readonly surahService: SurahService ) {}

  @Get( ":id" )
  get( @Param() params: { id: string }, @Query() query: { embed?: string } ): Promise<Surah> {
    const options: SurahGetOptions = {}

    if( query.embed ) {
      if( query.embed.includes( "ayahs" ) ) {
        options.embedAyahs = true
      }

      if( query.embed.includes( "translations" ) ) {
        options.embedAyahs = true
      }
    }

    return this.surahService.get( params.id, options )
  }

  @Get( ":id/ayahs" )
  async getAyahs( @Param() params: { id: string }, @Query() query: { page?: string, perPage?: string, translations?: string } ) {
    const options: SurahGetAyahOptions = getPaginationOptions( query )

    if( query.translations ) {
      options.translations = query.translations.split( "," )
    }

    return this.surahService.getAyahs( params.id, options )
  }

  @Get()
  query(): Promise<Surah[]> {
    return this.surahService.query()
  }
}
