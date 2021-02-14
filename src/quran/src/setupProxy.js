/* eslint-disable */
const { createProxyMiddleware } = require( "http-proxy-middleware" )

module.exports = function( app ) {
  const options = {
    changeOrigin: true,
    secure: false,
    target: "https://local.noblequran.cloud",
  }

  const proxy = createProxyMiddleware( options )

  app.use( ( req, res, next ) => {
    if( req.headers.accept === "application/json" ) {
      return proxy( req, res, next )
    }

    return next()
  } )
}
