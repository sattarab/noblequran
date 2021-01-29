import { Injectable } from "@nestjs/common"
import { omit } from "lodash"
import { Collection, Db, FilterQuery } from "mongodb"

import { MongoDbException } from "../../common/helpers/error.helper"
import { InjectDb } from "../../mongo/mongo.decorators"
import { Translation } from "../types/translation.type"

interface TranslationDoc {
  _id: number
  translations: Array<{
    translator_id: string
    text: string
  }>
}

@Injectable()
export class TranslationsRepository {
  private readonly collection: Collection<TranslationDoc>

  constructor( @InjectDb() private readonly db: Db ) {
    this.collection = this.db.collection<TranslationDoc>( "translations" )
  }

  private fromDocument = ( translation_doc: TranslationDoc ): Translation => {
    return {
      ...omit( translation_doc, "_id" ),
      id: `${ translation_doc._id }`,
    } as Translation
  }

  find() {
    return this.collection.find().sort( [ [ "number", 1 ] ] ).toArray()
      .catch( ( err ) => { throw new MongoDbException( err ) } )
      .then( ( translation_docs ) => translation_docs.map( this.fromDocument ) )
  }

  findByAyahIds( ayah_ids: string[] ): Promise<Translation[]> {
    const translations_query: FilterQuery<TranslationDoc> = {
      _id: { $in: ayah_ids.map( parseInt ) },
    }

    return this.collection.find( translations_query ).sort( [ [ "number", 1 ] ] ).toArray()
      .catch( ( err ) => { throw new MongoDbException( err ) } )
      .then( ( translation_docs ) => translation_docs.map( this.fromDocument ) )
  }
}
