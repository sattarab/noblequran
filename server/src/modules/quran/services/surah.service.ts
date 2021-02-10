import { Injectable, NotFoundException } from "@nestjs/common"
import { isEmpty, pick } from "lodash"

import { PaginationOptions } from "../../common/helpers/pagination.helper"
import { AyahsRepository } from "../repositories/ayahs.repository"
import { SurahsRepository } from "../repositories/surahs.repository"
import { TranslationsRepository } from "../repositories/translations.repository"
import { Surah } from "../types/surah.type"
import { Translation } from "../types/translation.type"

export interface SurahGetOptions {
  embed_ayahs?: boolean
}

export interface SurahGetAyahOptions extends PaginationOptions {
  translations?: string[]
}

@Injectable()
export class SurahService {
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

    if( options.translations ) {
      const translation_promises: Array<Promise<Translation[]>> = []
      for( const translation_name of options.translations ) {
        translation_promises.push( this.translationsRepository.findByAyahIds( translation_name, ayahs_response.items.map( ( ayah ) => ayah.id ) ) )
      }

      const translations = await Promise.all( translation_promises )

      if( ! isEmpty( translations ) ) {
        for( const [ index, translation_identifier ] of options.translations.entries() ) {
          const ayah_translations = translations[ index ]

          if( isEmpty( ayah_translations ) ) {
            continue
          }

          for( const [ ayah_index, ayah ] of ayahs_response.items.entries() ) {
            if( ! ayah.translations ) {
              ayah.translations = {}
            }
            ayah.translations[ translation_identifier ] = ayah_translations[ ayah_index ].text
          }
        }
      }
    }

    return ayahs_response
  }

  query(): Promise<Surah[]> {
    return this.surahsRepository.find()
  }
}

