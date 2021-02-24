import { Injectable } from "@nestjs/common"
import type { FilterQuery } from "mongodb"
import { Db } from "mongodb"

import { MongoDbException } from "../../common/helpers/error.helper"
import { parseIntId } from "../../common/helpers/utils.helper"
import { InjectDb } from "../../mongo/mongo.decorators"
import type { Translation } from "../types/translation.type"

interface TranslationDoc {
  _id: number
  hizb: number
  juz: number
  manzil: number
  number: number
  numberInSurah: number
  page: number
  ruku: number
  surahId: number
  text: string
}

@Injectable()
export class TranslationsRepository {
  constructor( @InjectDb() private readonly db: Db ) {
  }

  private fromDocument = ( translationDoc: TranslationDoc ): Translation => {
    return {
      id: `${ translationDoc._id }`,
      hizb: translationDoc.hizb,
      juz: translationDoc.juz,
      manzil: translationDoc.manzil,
      number: translationDoc.number,
      numberInSurah: translationDoc.numberInSurah,
      page: translationDoc.page,
      ruku: translationDoc.ruku,
      text: translationDoc.text,
      surahId: `${ translationDoc.surahId }`,
    } as Translation
  }

  find( translatorId: string ): Promise<Translation[]> {
    return this.db.collection( `translations.${ translatorId }` ).find().sort( [ [ "number", 1 ] ] ).toArray()
      .catch( ( err ) => { throw new MongoDbException( err ) } )
      .then( ( translationDocs ) => translationDocs.map( this.fromDocument ) )
  }

  findByAyahIds( name: string, ayahIds: string[] ): Promise<Translation[]> {
    const translationsQuery: FilterQuery<TranslationDoc> = {
      _id: { $in: ayahIds.map( parseIntId ) },
    }

    return this.db.collection( `translations.${ name }` ).find( translationsQuery ).sort( [ [ "number", 1 ] ] ).toArray()
      .catch( ( err ) => { throw new MongoDbException( err ) } )
      .then( ( translationDocs ) => translationDocs.map( this.fromDocument ) )
  }
}
