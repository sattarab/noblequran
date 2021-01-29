import { Injectable } from "@nestjs/common"
import { omit } from "lodash"
import { Collection, Db, FilterQuery } from "mongodb"

import { MongoDbException } from "../../common/helpers/error.helper"
import { getPaginationResults, PaginationOptions, PaginationResults } from "../../common/helpers/pagination.helper"
import { InjectDb } from "../../mongo/mongo.decorators"
import { Ayah } from "../types/ayah.type"

interface AyahDoc {
  _id: number
  hizb: number
  juz: number
  manzil: number
  number: number
  number_in_surah: number
  page: number
  ruku: number
  surah_id: number
  text: {
    indopak: string
    mushaf: string
    simple: string
    uthmani: string
  }
}

@Injectable()
export class AyahsRepository {
  private readonly collection: Collection<AyahDoc>

  constructor( @InjectDb() private readonly db: Db ) {
    this.collection = this.db.collection<AyahDoc>( "ayahs" )
  }

  private fromDocument = ( ayah_doc: AyahDoc ): Ayah => {
    return {
      ...omit( ayah_doc, "_id", "surah_id" ),
      id: `${ ayah_doc._id }`,
      surah_id: `${ ayah_doc.surah_id }`,
    } as Ayah
  }

  find() {
    return this.collection.find().sort( [ [ "number", 1 ] ] ).toArray()
      .catch( ( err ) => { throw new MongoDbException( err ) } )
      .then( ( ayah_docs ) => ayah_docs.map( this.fromDocument ) )
  }

  findByJuz( juz: string ) {
    return this.collection.find( { juz: parseInt( juz ) } ).sort( [ [ "number", 1 ] ] ).toArray()
      .catch( ( err ) => { throw new MongoDbException( err ) } )
      .then( ( ayah_docs ) => ayah_docs.map( this.fromDocument ) )
  }

  findBySurahId( surah_id: string ) {
    return this.collection.find( { surah_id: parseInt( surah_id ) } ).sort( [ [ "number", 1 ] ] ).toArray()
      .catch( ( err ) => { throw new MongoDbException( err ) } )
      .then( ( ayah_docs ) => ayah_docs.map( this.fromDocument ) )
  }

  async findOneById( id: string ) {
    const ayah_doc = await this.collection.findOne( { _id: parseInt( id ) } )
      .catch( ( err ) => { throw new MongoDbException( err ) } )

    if( ! ayah_doc ) {
      return null
    }

    return this.fromDocument( ayah_doc )
  }

  findPaginatedByJuz( juz: string, options: PaginationOptions ): Promise<PaginationResults<Ayah>> {
    const query: FilterQuery<AyahDoc> = {
      juz: parseInt( juz ),
    }
    options.sort = [ [ "number", 1 ] ]
    return getPaginationResults( this.collection, query, options, this.fromDocument )
      .catch( ( err ) => { throw new MongoDbException( err ) } )
  }

  findPaginatedBySurahId( surah_id: string, options: PaginationOptions ): Promise<PaginationResults<Ayah>> {
    const query: FilterQuery<AyahDoc> = {
      surah_id: parseInt( surah_id ),
    }
    options.sort = [ [ "number", 1 ] ]
    return getPaginationResults( this.collection, query, options, this.fromDocument )
      .catch( ( err ) => { throw new MongoDbException( err ) } )
  }
}
