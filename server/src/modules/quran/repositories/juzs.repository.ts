import { Injectable } from "@nestjs/common"
import { omit } from "lodash"
import { Collection, Db } from "mongodb"

import { MongoDbException } from "../../common/helpers/error.helper"
import { parseIntId } from "../../common/helpers/utils.helper"
import { InjectDb } from "../../mongo/mongo.decorators"
import { Juz } from "../types/juz.type"

interface JuzDoc {
  _id: number
  number: string
  verses: Array<{
    end: number
    start: number
    surah_id: number
  }>
}

@Injectable()
export class JuzsRepository {
  private readonly collection: Collection<JuzDoc>

  constructor( @InjectDb() private readonly db: Db ) {
    this.collection = this.db.collection<JuzDoc>( "juzs" )
  }

  private fromDocument = ( juz_doc: JuzDoc ): Juz => {
    return {
      ...omit( juz_doc, "_id" ),
      id: `${ juz_doc._id }`,
      verses: juz_doc.verses.map( ( verse_doc ) => {
        return {
          end: verse_doc.end,
          start: verse_doc.start,
          surah_id: `${ verse_doc.surah_id }`,
        }
      } ),
    } as Juz
  }

  find() {
    return this.collection.find().sort( [ [ "number", 1 ] ] ).toArray()
      .catch( ( err ) => { throw new MongoDbException( err ) } )
      .then( ( juz_docs ) => juz_docs.map( this.fromDocument ) )
  }

  async findOneById( id: string ) {
    const juz_doc = await this.collection.findOne( { _id: parseIntId( id ) } )
      .catch( ( err ) => { throw new MongoDbException( err ) } )

    if( ! juz_doc ) {
      return null
    }

    return this.fromDocument( juz_doc )
  }
}
