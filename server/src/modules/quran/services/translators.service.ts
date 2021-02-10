import { Injectable } from "@nestjs/common"
import { groupBy } from "lodash"

import { TranslatorsRepository } from "../repositories/translators.repository"
import { Translator } from "../types/translator.type"

@Injectable()
export class TranslatorService {
  constructor( private readonly translatorsRepository: TranslatorsRepository ) {}

  query(): Promise<Translator[]> {
    return this.translatorsRepository.find()
  }
}