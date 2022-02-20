import { Injectable } from "@nestjs/common"
import type { Collection } from "mongodb"
import { Db } from "mongodb"

import { MongoDbException } from "../../common/helpers/error.helper"
import { parseIntId } from "../../common/helpers/utils.helper"
import { InjectDb } from "../../mongo/mongo.decorators"
import type { Juz } from "../types/juz.type"

interface JuzDoc {
  _id: number
  number: string
  verses: Array<{
    end: number
    start: number
    surahId: number
  }>
}

@Injectable()
export class JuzsRepository {
  private readonly collection: Collection<JuzDoc>

  constructor( @InjectDb() private readonly db: Db ) {
    this.collection = this.db.collection<JuzDoc>( "juzs" )
  }

  private fromDocument = ( juzDoc: JuzDoc ): Juz => {
    return {
      id: `${ juzDoc._id }`,
      number: juzDoc.number,
      verses: juzDoc.verses.map( ( verseDoc ) => {
        return {
          end: verseDoc.end,
          start: verseDoc.start,
          surahId: `${ verseDoc.surahId }`,
        }
      } ),
    } as Juz
  }

  find(): Promise<Juz[]> {
    return this.collection.find().sort( [ [ "number", 1 ] ] ).toArray()
      .catch( ( err ) => { throw new MongoDbException( err ) } )
      .then( ( juzDocs ) => juzDocs.map( this.fromDocument ) )
  }

  async findOneById( id: string ): Promise<Juz> {
    const juzDoc = await this.collection.findOne( { _id: parseIntId( id ) } )
      .catch( ( err ) => { throw new MongoDbException( err ) } )

    if( ! juzDoc ) {
      return null
    }

    return this.fromDocument( juzDoc )
  }
}
