import { Injectable } from "@nestjs/common"
import { omit } from "lodash"
import { Collection, Db } from "mongodb"

import { MongoDbException } from "../../common/helpers/error.helper"
import { InjectDb } from "../../mongo/mongo.decorators"
import { Translator } from "../types/translator.type"

interface TranslatorDoc {
  _id: string
  name: string
  language: string
  translations: Array<{
    language: string
    name: string
  }>
}

@Injectable()
export class TranslatorsRepository {
  private readonly collection: Collection<TranslatorDoc>

  constructor( @InjectDb() private readonly db: Db ) {
    this.collection = this.db.collection<TranslatorDoc>( "translators" )
  }

  private fromDocument = ( translator_doc: TranslatorDoc ): Translator => {
    return {
      ...omit( translator_doc, "_id" ),
      id: `${ translator_doc._id }`,
    } as Translator
  }

  find() {
    return this.collection.find().sort( [ [ "name", 1 ] ] ).toArray()
      .catch( ( err ) => { throw new MongoDbException( err ) } )
      .then( ( translator_docs ) => translator_docs.map( this.fromDocument ) )
  }
}
