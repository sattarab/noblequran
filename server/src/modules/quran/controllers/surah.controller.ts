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
        options.embed_ayahs = true
      }

      if( query.embed.includes( "translations" ) ) {
        options.embed_ayahs = true
      }
    }

    return this.surahService.get( params.id, options )
  }

  @Get( ":id/ayahs" )
  async getAyahs(
    @Param() params: {
      id: string
    },
    @Query() query: {
      page?: string
      per_page?: string
      embed?: string
    }
  ) {
    const options: SurahGetAyahOptions = getPaginationOptions( query )

    if( query.embed ) {
      const embeds = query.embed.split( "," )

      if( embeds.includes( "translations" ) ) {
        options.embed_translation = true
      }

      if( embeds.includes( "transliterations" ) ) {
        options.embed_transliterations = true
      }
    }

    return this.surahService.getAyahs( params.id, options )
  }

  @Get()
  query(): Promise<Surah[]> {
    return this.surahService.query()
  }
}
