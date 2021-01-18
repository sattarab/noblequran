import { Injectable } from "@nestjs/common"
import { omit } from "lodash"
import { Collection, Db } from "mongodb"

import { MongoDbException } from "../../common/helpers/error.helper"
import { InjectDb } from "../../mongo/mongo.decorators"
import { Surah } from "../types/surah.type"

interface SurahDoc {
  _id: number
  has_bismillah: boolean
  name: string
  number: number
  number_of_ayahs: number
  query_indexes: string[]
  revelation: {
    order: number
    place: string
  }
  translations: Array<{
    language: string
    text: string
  }>
  transliterations: Array<{
    language: string
    text: string
  }>
}

@Injectable()
export class SurahsRepository {
  private readonly collection: Collection<SurahDoc>

  constructor( @InjectDb() private readonly db: Db ) {
    this.collection = this.db.collection<SurahDoc>( "surahs" )
  }

  private fromDocument = ( surah_doc: SurahDoc ): Surah => {
    return {
      ...omit( surah_doc, "_id" ),
      id: `${ surah_doc._id }`,
    } as Surah
  }

  find() {
    return this.collection.find().sort( [ [ "number", 1 ] ] ).toArray()
      .catch( ( err ) => { throw new MongoDbException( err ) } )
      .then( ( surah_docs ) => surah_docs.map( this.fromDocument ) )
  }

  async findOneById( id: string ) {
    const surah_doc = await this.collection.findOne( { _id: parseInt( id ) } )
      .catch( ( err ) => { throw new MongoDbException( err ) } )

    if( ! surah_doc ) {
      return null
    }

    return this.fromDocument( surah_doc )
  }
}