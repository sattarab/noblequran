import { Controller, Get, Param, Query, Res } from "@nestjs/common"
import { Response } from "express"

import { ValidationException } from "../../common/helpers/error.helper"
import type { PaginationResults } from "../../common/helpers/pagination.helper"
import { getPaginationOptions } from "../../common/helpers/pagination.helper"
import type { SurahGetAyahOptions, SurahGetOptions } from "../services/surah.service"
import { SurahService } from "../services/surah.service"
import type { Ayah, FormatType } from "../types/ayah.type"
import type { Surah } from "../types/surah.type"

@Controller( "surahs" )
export class SurahController {
  constructor( private readonly surahService: SurahService ) {
  }

  @Get( "ayahs/download" )
  async download(
    @Res() res: Response,
    @Query() query: {
      ayahIds: string
      format: FormatType
    },
  ): Promise<void> {
    if( ! query.ayahIds ) {
      throw new ValidationException( "AyahIds is a required field" )
    }

    if( ! query.format && ! [ "uthmani", "mushaf", "indopak" ].includes( query.format ) ) {
      throw new ValidationException( "Format is a required field" )
    }

    const ayahIds = query.ayahIds.split( "," )
    await this.surahService.download( res, ayahIds, query.format )
    res.end()
  }

  @Get( ":id" )
  get(
    @Param() params: {
      id: string
    },
    @Query() query: {
      embed?: string
    },
  ): Promise<Surah> {
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
  async getAyahs(
    @Param() params: {
      id: string
    },
    @Query() query: {
      page?: string
      perPage?: string
      translations?: string
    },
  ): Promise<PaginationResults<Ayah>> {
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
