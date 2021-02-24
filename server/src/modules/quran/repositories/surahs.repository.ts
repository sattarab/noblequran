import { Injectable } from "@nestjs/common"
import type { Collection } from "mongodb"
import { Db } from "mongodb"

import { MongoDbException } from "../../common/helpers/error.helper"
import { parseIntId } from "../../common/helpers/utils.helper"
import { InjectDb } from "../../mongo/mongo.decorators"
import type { Surah } from "../types/surah.type"

interface SurahDoc {
  _id: number
  hasBismillah: boolean
  name: string
  number: number
  numberOfAyahs: number
  queryIndexes: string[]
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

  private fromDocument = ( surahDoc: SurahDoc ): Surah => {
    return {
      id: `${ surahDoc._id }`,
      hasBismillah: surahDoc.hasBismillah,
      name: surahDoc.name,
      number: surahDoc.number,
      numberOfAyahs: surahDoc.numberOfAyahs,
      revelation: surahDoc.revelation,
      translations: surahDoc.translations,
      transliterations: surahDoc.transliterations,
    } as Surah
  }

  find(): Promise<Surah[]> {
    return this.collection.find().sort( [ [ "number", 1 ] ] ).toArray()
      .catch( ( err ) => { throw new MongoDbException( err ) } )
      .then( ( surahDocs ) => surahDocs.map( this.fromDocument ) )
  }

  async findOneById( id: string ): Promise<Surah> {
    const surahDoc = await this.collection.findOne( { _id: parseIntId( id ) } )
      .catch( ( err ) => { throw new MongoDbException( err ) } )

    if( ! surahDoc ) {
      return null
    }

    return this.fromDocument( surahDoc )
  }
}
