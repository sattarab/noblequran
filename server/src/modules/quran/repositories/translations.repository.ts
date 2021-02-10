import { Injectable } from "@nestjs/common"
import { omit } from "lodash"
import { Db, FilterQuery } from "mongodb"

import { MongoDbException } from "../../common/helpers/error.helper"
import { parseIntId } from "../../common/helpers/utils.helper"
import { InjectDb } from "../../mongo/mongo.decorators"
import { Translation } from "../types/translation.type"

interface TranslationDoc {
  _id: number
  hizb: number
  juz: number
  manzil: number
  number: number
  number_in_surah: number
  page: number
  ruku: number
  surah_id: number
  text: string
}

@Injectable()
export class TranslationsRepository {
  constructor( @InjectDb() private readonly db: Db ) {
  }

  private fromDocument = ( translation_doc: TranslationDoc ): Translation => {
    return {
      ...omit( translation_doc, "_id" ),
      id: `${ translation_doc._id }`,
      surah_id: `${ translation_doc.surah_id }`,
    } as Translation
  }

  find( name ) {
    return this.db.collection( `translations.${ name }` ).find().sort( [ [ "number", 1 ] ] ).toArray()
      .catch( ( err ) => { throw new MongoDbException( err ) } )
      .then( ( translation_docs ) => translation_docs.map( this.fromDocument ) )
  }

  findByAyahIds( name: string, ayah_ids: string[] ): Promise<Translation[]> {
    const translations_query: FilterQuery<TranslationDoc> = {
      _id: { $in: ayah_ids.map( parseIntId ) },
    }

    return this.db.collection( `translations.${ name }` ).find( translations_query ).sort( [ [ "number", 1 ] ] ).toArray()
      .catch( ( err ) => { throw new MongoDbException( err ) } )
      .then( ( translation_docs ) => translation_docs.map( this.fromDocument ) )
  }
}
