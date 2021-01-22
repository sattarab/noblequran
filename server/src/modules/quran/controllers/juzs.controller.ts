import { Controller, Get, Param, Query } from "@nestjs/common"

import { getPaginationOptions } from "../../common/helpers/pagination.helper"
import { JuzGetAyahOptions, JuzGetOptions, JuzsService } from "../services/juzs.service"
import { Juz } from "../types/juz.type"

@Controller( "juzs" )
export class JuzsController {
  constructor( private readonly juzsService: JuzsService ) {}

  @Get( ":id" )
  get( @Param() params: { id: string }, @Query() query: { embed?: string } ): Promise<Juz> {
    const options: JuzGetOptions = {}

    if( query.embed ) {
      if( query.embed.includes( "ayahs" ) ) {
        options.embed_ayahs = true
      }

      if( query.embed.includes( "translations" ) ) {
        options.embed_ayahs = true
      }
    }

    return this.juzsService.get( params.id, options )
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
    const options: JuzGetAyahOptions = getPaginationOptions( query )

    if( query.translations ) {
      options.translations = query.translations.split( "," )
    }

    if( query.transliterations ) {
      options.transliterations = query.transliterations.split( "," )
    }

    return this.juzsService.getAyahs( params.id, options )
  }

  @Get()
  query(): Promise<Juz[]> {
    return this.juzsService.query()
  }
}