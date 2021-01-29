import { Injectable, NotFoundException } from "@nestjs/common"
import { isEmpty, pick } from "lodash"

import { PaginationOptions } from "../../common/helpers/pagination.helper"
import { AyahsRepository } from "../repositories/ayahs.repository"
import { SurahsRepository } from "../repositories/surahs.repository"
import { Surah } from "../types/surah.type"
import { TranslationsRepository } from "../repositories/translations.repository"

export interface SurahGetOptions {
  embed_ayahs?: boolean
}

export interface SurahGetAyahOptions extends PaginationOptions {
  translations?: string[]
  transliterations?: string[]
}

@Injectable()
export class SurahsService {
  constructor(
    private readonly ayahsRepository: AyahsRepository,
    private readonly surahsRepository: SurahsRepository,
    private readonly translationsRepository: TranslationsRepository,
  ) {}

  async get( id: string, options: SurahGetOptions = {} ): Promise<Surah> {
    const surah = await this.surahsRepository.findOneById( id )

    if( ! surah ) {
      throw new NotFoundException()
    }

    if( options.embed_ayahs ) {
      surah.ayahs = await this.ayahsRepository.findBySurahId( id )
    }

    return surah
  }

  async getAyahs( id: string, options: SurahGetAyahOptions ) {
    const surah = await this.surahsRepository.findOneById( id )

    if( ! surah ) {
      throw new NotFoundException()
    }

    const pagination_options: PaginationOptions = pick( options, "page", "per_page" )
    const ayahs_response = await this.ayahsRepository.findPaginatedBySurahId( id, pagination_options )
    if( ! isEmpty( options.translations ) ) {
      console.log( "options", options.translations )
      const translations = await this.translationsRepository.findByAyahIds( ayahs_response.items.map( ( ayah ) => ayah.id ) )
      for( const ayah of ayahs_response.items ) {
        const ayah_translations = translations.find( ( translation ) => translation.id === ayah.id )
        if( ayah_translations ) {
          ayah.translations = [ ...ayah_translations.translations ]
        }
      }
    }

    return ayahs_response
  }

  query(): Promise<Surah[]> {
    return this.surahsRepository.find()
  }
}

