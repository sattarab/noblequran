import { Injectable, NotFoundException } from "@nestjs/common"
import { pick } from "lodash"

import { PaginationOptions } from "../../common/helpers/pagination.helper"
import { AyahsRepository } from "../repositories/ayahs.repository"
import { JuzsRepository } from "../repositories/juzs.repository"
import { Juz } from "../types/juz.type"

export interface JuzGetOptions {
  embed_ayahs?: boolean
}

export interface JuzGetAyahOptions extends PaginationOptions {
  translations?: string[]
  transliterations?: string[]
}

@Injectable()
export class JuzService {
  constructor(
    private readonly ayahsRepository: AyahsRepository,
    private readonly juzsRepository: JuzsRepository,
  ) {}

  async get( id: string, options: JuzGetOptions = {} ): Promise<Juz> {
    const juz = await this.juzsRepository.findOneById( id )

    if( ! juz ) {
      throw new NotFoundException()
    }

    if( options.embed_ayahs ) {
      juz.ayahs = await this.ayahsRepository.findByJuz( id )
    }

    return juz
  }

  async getAyahs( id: string, options: JuzGetAyahOptions ) {
    const juz = await this.juzsRepository.findOneById( id )

    if( ! juz ) {
      throw new NotFoundException()
    }

    const pagination_options: PaginationOptions = pick( options, "page", "per_page" )
    return this.ayahsRepository.findPaginatedByJuz( id, pagination_options )
  }

  query(): Promise<Juz[]> {
    return this.juzsRepository.find()
  }
}
