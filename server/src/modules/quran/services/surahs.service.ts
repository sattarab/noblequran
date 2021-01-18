import { Injectable, NotFoundException } from "@nestjs/common"
import { pick } from "lodash"

import { PaginationOptions } from "../../common/helpers/pagination.helper"
import { AyahsRepository } from "../repositories/ayahs.repository"
import { SurahsRepository } from "../repositories/surahs.repository"
import { Surah } from "../types/surah.type"

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
    return this.ayahsRepository.findPaginatedBySurahId( id, pagination_options )
  }

  query(): Promise<Surah[]> {
    return this.surahsRepository.find()
  }
}

