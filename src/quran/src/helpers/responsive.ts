// The value are pulled from TailwindCSS
// See https://tailwindcss.com/docs/responsive-design
export const SMALL_SCREEN_WIDTH = 640
export const MEDIUM_SCREEN_WIDTH = 768
export const MEDIUM_SCREEN_MAX_WIDTH = 1023
export const LARGE_SCREEN_WIDTH = 1024
export const EXTRA_LARGE_SCREEN_WIDTH = 1280

export const SMALL_SCREEN_MEDIA_QUERY = `( min-width: ${ SMALL_SCREEN_WIDTH }px )`
export const MEDIUM_SCREEN_MEDIA_QUERY = `( min-width: ${ MEDIUM_SCREEN_WIDTH }px )`
export const LARGE_SCREEN_MEDIA_QUERY = `( min-width: ${ LARGE_SCREEN_WIDTH }px )`
export const EXTRA_LARGE_SCREEN_MEDIA_QUERY = `( min-width: ${ EXTRA_LARGE_SCREEN_WIDTH }px )`

export const MOBILE_SCREEN_MEDIA_QUERY = `( max-width: ${ MEDIUM_SCREEN_WIDTH }px )`

const createMediaQueryMatcher = ( mediaQuery: string ) => {
  return () => {
    return window.matchMedia( mediaQuery ).matches
  }
}

export const isGreaterThanSmallScreen = createMediaQueryMatcher( SMALL_SCREEN_MEDIA_QUERY )
export const isGreaterThanMediumScreen = createMediaQueryMatcher( MEDIUM_SCREEN_MEDIA_QUERY )
export const isGreaterThanLargeScreen = createMediaQueryMatcher( LARGE_SCREEN_MEDIA_QUERY )
export const isGreaterThanExtraLargeScreen = createMediaQueryMatcher( EXTRA_LARGE_SCREEN_MEDIA_QUERY )
