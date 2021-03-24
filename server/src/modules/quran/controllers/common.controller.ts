import { Controller, Get, HttpCode, Response } from "@nestjs/common"
import { Response as ExpressResponse } from "express"

@Controller()
export class CommonController {
  @Get( "sitemap.xml" )
  sitemap( @Response() res: ExpressResponse ): void {
    res.header( "Content-Type", "application/xml" )
    return
  }

  @Get( "status" )
  @HttpCode( 200 )
  status(): void {
    return
  }
}
