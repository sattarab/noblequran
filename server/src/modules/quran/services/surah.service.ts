import { Injectable, NotFoundException } from "@nestjs/common"
import * as archiver from "archiver"
import type { Response } from "express"
import { isEmpty, pick } from "lodash"

import type { PaginationOptions, PaginationResults } from "../../common/helpers/pagination.helper"
import { AyahsRepository } from "../repositories/ayahs.repository"
import { SurahsRepository } from "../repositories/surahs.repository"
import { TranslationsRepository } from "../repositories/translations.repository"
import type { Ayah, FormatType } from "../types/ayah.type"
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
  ) {
  }

  async download( res: Response, ayahIds: string[], format: FormatType ): Promise<void> {
    const zip = archiver( "zip", )
    const ayahs = await this.ayahsRepository.findByIds( ayahIds )
    const ayahsGroup: { [ surahId: string ]: Ayah[] } = {}
    const surahIds: string[] = []

    for( const ayah of ayahs ) {
      if( ! surahIds.includes( ayah.surahId ) ) {
        surahIds.push( ayah.surahId )
      }

      if( ! ayahsGroup[ ayah.surahId ] ) {
        ayahsGroup[ ayah.surahId ] = []
      }

      ayahsGroup[ ayah.surahId ].push( ayah )
    }

    zip.pipe( res )

    zip.on( "error", ( err ) => {
      throw new Error( err.message )
    } )

    const surahs = await this.surahsRepository.findByIds( surahIds )
    for( const [ surahId, surahAyahs ] of Object.entries( ayahsGroup ) ) {
      const surah = surahs.find( ( selectedSurah ) => selectedSurah.id === surahId )
      let ayahsCsv = ""
      for( const surahAyah of surahAyahs ) {
        ayahsCsv += `${ surah.number }:${ surahAyah.numberInSurah } ${ surahAyah.text[ format ] }\n`
      }

      zip.append( ayahsCsv, { name: `${ surah.transliterations[ 0 ].text }.txt` } )
    }

    await zip.finalize()
  }

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

