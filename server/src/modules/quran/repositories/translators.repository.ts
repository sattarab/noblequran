import { Injectable } from "@nestjs/common"
import { omit } from "lodash"
import type { Collection } from "mongodb"
import { Db } from "mongodb"

import { MongoDbException } from "../../common/helpers/error.helper"
import { InjectDb } from "../../mongo/mongo.decorators"
import type { Translator } from "../types/translator.type"

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

  private fromDocument = ( translatorDoc: TranslatorDoc ): Translator => {
    return {
      id: `${ translatorDoc._id }`,
      name: translatorDoc.name,
      translations: translatorDoc.translations,
    } as Translator
  }

  find(): Promise<Translator[]> {
    return this.collection.find().sort( [ [ "name", 1 ] ] ).toArray()
      .catch( ( err ) => { throw new MongoDbException( err ) } )
      .then( ( translatorDocs ) => translatorDocs.map( this.fromDocument ) )
  }
}
