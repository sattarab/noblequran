import { Injectable, NotFoundException } from "@nestjs/common"
import { isEmpty, pick } from "lodash"

import type { PaginationOptions, PaginationResults } from "../../common/helpers/pagination.helper"
import { AyahsRepository } from "../repositories/ayahs.repository"
import { SurahsRepository } from "../repositories/surahs.repository"
import { TranslationsRepository } from "../repositories/translations.repository"
import type { Ayah } from "../types/ayah.type"
import type { Surah } from "../types/surah.type"
import type { Translation } from "../types/translation.type"

export interface SurahGetOptions {
  embedAyahs?: boolean
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

    if( options.embedAyahs ) {
      surah.ayahs = await this.ayahsRepository.findBySurahId( id )
    }

    return surah
  }

  async getAyahs( id: string, options: SurahGetAyahOptions ): Promise<PaginationResults<Ayah>> {
    const surah = await this.surahsRepository.findOneById( id )

    if( ! surah ) {
      throw new NotFoundException()
    }

    const paginationOptions: PaginationOptions = pick( options, "page", "perPage" )
    const ayahsResponse = await this.ayahsRepository.findPaginatedBySurahId( id, paginationOptions )

    if( options.translations ) {
      const translationPromises: Array<Promise<Translation[]>> = []
      for( const translationName of options.translations ) {
        translationPromises.push( this.translationsRepository.findByAyahIds( translationName, ayahsResponse.items.map( ( ayah ) => ayah.id ) ) )
      }

      const translations = await Promise.all( translationPromises )

      if( ! isEmpty( translations ) ) {
        for( const [ index, translationIdentifier ] of options.translations.entries() ) {
          const ayahTranslations = translations[ index ]

          if( isEmpty( ayahTranslations ) ) {
            continue
          }

          for( const [ ayahIndex, ayah ] of ayahsResponse.items.entries() ) {
            if( ! ayah.translations ) {
              ayah.translations = {}
            }
            ayah.translations[ translationIdentifier ] = ayahTranslations[ ayahIndex ].text
          }
        }
      }
    }

    return ayahsResponse
  }

  query(): Promise<Surah[]> {
    return this.surahsRepository.find()
  }
}

