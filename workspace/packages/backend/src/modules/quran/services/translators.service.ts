import { Injectable } from "@nestjs/common"

import { TranslatorsRepository } from "../repositories/translators.repository"
import type { Translator } from "../types/translator.type"

@Injectable()
export class TranslatorService {
  constructor( private readonly translatorsRepository: TranslatorsRepository ) {
  }

  query(): Promise<Translator[]> {
    return this.translatorsRepository.find()
  }
}
