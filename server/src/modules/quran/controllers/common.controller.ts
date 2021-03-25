import { Controller, Get, HttpCode, Response } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Response as ExpressResponse } from "express"
import { SitemapStream, streamToPromise } from "sitemap"
import { createGzip } from "zlib"

import { ErrorService } from "../../common/helpers/error.helper"

@Controller()
export class CommonController {
  sitemap: Buffer

  constructor(
    readonly configService: ConfigService,
    readonly errorService: ErrorService,
  ) {
  }

  @Get( "sitemap.xml" )
  getSitemap( @Response() res: ExpressResponse ): void {
    res.header( "Content-Type", "application/xml" )
    res.header( "Content-Encoding", "gzip" )
    if( this.sitemap ) {
      res.send( this.sitemap )
      return
    }

    try {
      const siteMapStream = new SitemapStream( { hostname: this.configService.get( "baseUrl" ) } )
      const pipeline = siteMapStream.pipe( createGzip() )
      siteMapStream.write( { url: "/", changefreq: "weekly", priority: 1.0 } )
      siteMapStream.write( { url: "/yaseen/", changefreq: "weekly", priority: 0.8 } )
      siteMapStream.write( { url: "/al-kahf/", changefreq: "weekly", priority: 0.8 } )
      siteMapStream.write( { url: "/ar-rahman/", changefreq: "weekly", priority: 0.5 } )
      siteMapStream.write( { url: "/al-baqarah/", changefreq: "weekly", priority: 0.5 } )
      siteMapStream.write( { url: "/al-fatihah/", changefreq: "weekly", priority: 0.5 } )
      streamToPromise( pipeline ).then( ( map ) => this.sitemap = map )
      siteMapStream.end()
      pipeline.pipe( res ).on( "error", ( err ) => {
        throw err
      } )
    } catch( err ) {
      this.errorService.handleError( err )
      res.status( 500 ).end()
    }

    return
  }

  @Get( "status" )
  @HttpCode( 200 )
  getStatus(): void {
    return
  }
}
