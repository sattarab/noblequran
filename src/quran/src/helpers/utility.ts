const ESCAPE_REGEX = /([.*+?^=!:${}()|\[\]\/\\])/g

export function escapeRegex( string: string ){
  return string.replace( ESCAPE_REGEX, "\\$1" )
}