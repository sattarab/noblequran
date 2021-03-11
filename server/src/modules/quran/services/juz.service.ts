import { Injectable, NotFoundException } from "@nestjs/common"
import { pick } from "lodash"

import type { PaginationOptions, PaginationResults } from "../../common/helpers/pagination.helper"
import { AyahsRepository } from "../repositories/ayahs.repository"
import { JuzsRepository } from "../repositories/juzs.repository"
import type { Ayah } from "../types/ayah.type"
import type { Juz } from "../types/juz.type"

export interface JuzGetOptions {
  embedAyahs?: boolean
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
  ) {
  }

  async get( id: string, options: JuzGetOptions = {} ): Promise<Juz> {
    const juz = await this.juzsRepository.findOneById( id )

    if( ! juz ) {
      throw new NotFoundException()
    }

    if( options.embedAyahs ) {
      juz.ayahs = await this.ayahsRepository.findByJuz( id )
    }

    return juz
  }

  async getAyahs( id: string, options: JuzGetAyahOptions ): Promise<PaginationResults<Ayah>> {
    const juz = await this.juzsRepository.findOneById( id )

    if( ! juz ) {
      throw new NotFoundException()
    }

    const paginationOptions: PaginationOptions = pick( options, "page", "perPage" )
    return this.ayahsRepository.findPaginatedByJuz( id, paginationOptions )
  }

  query(): Promise<Juz[]> {
    return this.juzsRepository.find()
  }
}
