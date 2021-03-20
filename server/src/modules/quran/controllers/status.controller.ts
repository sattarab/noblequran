import { Controller, Get, HttpCode } from "@nestjs/common"

@Controller( "status" )
export class StatusController {
  @Get()
  @HttpCode( 200 )
  get(): void {
    return
  }
}
