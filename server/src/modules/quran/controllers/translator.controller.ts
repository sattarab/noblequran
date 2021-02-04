import { Controller, Get } from "@nestjs/common"

import { TranslatorService } from "../services/translators.service"
import { Translator } from "../types/translator.type"

@Controller( "translators" )
export class TranslatorController {
  constructor( private readonly translatorService: TranslatorService ) {}

  @Get()
  query(): Promise<Translator[]> {
    return this.translatorService.query()
  }
}
