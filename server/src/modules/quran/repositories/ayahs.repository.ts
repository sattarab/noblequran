import { Injectable } from "@nestjs/common"
import type { Collection, FilterQuery } from "mongodb"
import { Db } from "mongodb"

import { MongoDbException } from "../../common/helpers/error.helper"
import type { PaginationOptions, PaginationResults } from "../../common/helpers/pagination.helper"
import { getPaginationResults } from "../../common/helpers/pagination.helper"
import { parseIntId } from "../../common/helpers/utils.helper"
import { InjectDb } from "../../mongo/mongo.decorators"
import type { Ayah, WordType } from "../types/ayah.type"

interface AyahDoc {
  _id: number
  hizb: number
  juz: number
  manzil: number
  number: number
  numberInSurah: number
  page: number
  ruku: number
  surahId: number
  text: {
    indopak: string
    mushaf: string
    simple: string
    uthmani: string
  }
  words: Array<{
    _id: number
    text: {
      indopak: string
      mushaf: string
      uthmani: string
    }
    translations: Array<{
      language: string
      text: string
    }>
    type: WordType
  }>
}

@Injectable()
export class AyahsRepository {
  private readonly collection: Collection<AyahDoc>

  constructor( @InjectDb() private readonly db: Db ) {
    this.collection = this.db.collection<AyahDoc>( "ayahs" )
  }

  private fromDocument = ( ayahDoc: AyahDoc ): Ayah => {
    return {
      id: `${ ayahDoc._id }`,
      hizb: ayahDoc.hizb,
      juz: ayahDoc.juz,
      manzil: ayahDoc.manzil,
      number: ayahDoc.number,
      numberInSurah: ayahDoc.numberInSurah,
      page: ayahDoc.page,
      ruku: ayahDoc.ruku,
      text: ayahDoc.text,
      surahId: `${ ayahDoc.surahId }`,
      words: ayahDoc.words.map( ( word_doc ) => ( {
        id: `${ word_doc._id }`,
        text: word_doc.text,
        translations: word_doc.translations,
        type: word_doc.type,
      } ) ),
    } as Ayah
  }

  find(): Promise<Ayah[]> {
    return this.collection.find().sort( [ [ "number", 1 ] ] ).toArray()
      .catch( ( err ) => { throw new MongoDbException( err ) } )
      .then( ( ayahDocs ) => ayahDocs.map( this.fromDocument ) )
  }

  findByJuz( juzId: string ): Promise<Ayah[]> {
    return this.collection.find( { juzId: parseIntId( juzId ) } ).sort( [ [ "number", 1 ] ] ).toArray()
      .catch( ( err ) => { throw new MongoDbException( err ) } )
      .then( ( ayahDocs ) => ayahDocs.map( this.fromDocument ) )
  }

  findBySurahId( surahId: string ): Promise<Ayah[]> {
    return this.collection.find( { surahId: parseIntId( surahId ) } ).sort( [ [ "number", 1 ] ] ).toArray()
      .catch( ( err ) => { throw new MongoDbException( err ) } )
      .then( ( ayahDocs ) => ayahDocs.map( this.fromDocument ) )
  }

  async findOneById( id: string ): Promise<Ayah> {
    const ayahDoc = await this.collection.findOne( { _id: parseIntId( id ) } )
      .catch( ( err ) => { throw new MongoDbException( err ) } )

    if( ! ayahDoc ) {
      return null
    }

    return this.fromDocument( ayahDoc )
  }

  findPaginatedByJuz( juz: string, options: PaginationOptions ): Promise<PaginationResults<Ayah>> {
    const query: FilterQuery<AyahDoc> = {
      juz: parseIntId( juz ),
    }
    options.sort = [ [ "number", 1 ] ]
    return getPaginationResults( this.collection, query, options, this.fromDocument )
      .catch( ( err ) => { throw new MongoDbException( err ) } )
  }

  findPaginatedBySurahId( surahId: string, options: PaginationOptions ): Promise<PaginationResults<Ayah>> {
    const query: FilterQuery<AyahDoc> = {
      surahId: parseIntId( surahId ),
    }
    options.sort = [ [ "number", 1 ] ]
    return getPaginationResults( this.collection, query, options, this.fromDocument )
      .catch( ( err ) => { throw new MongoDbException( err ) } )
  }
}
