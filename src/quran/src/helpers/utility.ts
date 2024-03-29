import localforage from "localforage"

import { logError } from "./error"

const ESCAPE_REGEX = /([.*+?^=!:${}()|\[\]\/\\])/g
const RTL_LANGUAGE_CODES = [
  "ar",
  "dv",
  "fa",
  "ku",
  "ur",
]

export function capitalize( value: string ): string {
  return value.charAt( 0 ).toUpperCase() + value.slice( 1 )
}

export function escapeRegex( string: string ): string {
  return string.replace( ESCAPE_REGEX, "\\$1" )
}

export async function getItemFromStorage<T>( key: string ): Promise<T | null> {
  return localforage.getItem<T>( key )
    .catch( ( err ) => {
      logError( err )
      return null
    } )
}

export function getLanguageLabel( code: string ): string {
  switch( code ) {
    case "az": {
      return "Azerbaijani"
    }

    case "bg": {
      return "Bulgarian"
    }

    case "bn": {
      return "Bengali"
    }

    case "bs": {
      return "Bosnian"
    }

    case "cs": {
      return "Czech"
    }

    case "de": {
      return "German"
    }

    case "dv": {
      return "Dhivehi/Maldivian"
    }

    case "en": {
      return "English"
    }

    case "es": {
      return "Spanish"
    }

    case "fa": {
      return "Persian"
    }

    case "fr": {
      return "French"
    }

    case "ha": {
      return "Hausa"
    }

    case "hi": {
      return "Hindi"
    }

    case "id": {
      return "Indonesian"
    }

    case "it": {
      return "Italian"
    }

    case "ja": {
      return "Japanese"
    }

    case "ko": {
      return "Korean"
    }

    case "ku": {
      return "Kurdish"
    }

    case "ml": {
      return "Malayalam"
    }

    case "ms": {
      return "Malay"
    }

    case "nl": {
      return "Dutch"
    }

    case "no": {
      return "Norwegian"
    }

    case "pl": {
      return "Polish"
    }

    case "pt": {
      return "Portuguese"
    }

    case "ro": {
      return "Romanian"
    }

    case "ru": {
      return "Russian"
    }

    case "sd": {
      return "Sindhi"
    }

    case "si": {
      return "Sinhala"
    }

    case "so": {
      return "Somali"
    }

    case "sq": {
      return "Albanian"
    }

    case "sv": {
      return "Swedish"
    }

    case "sw": {
      return "Swahili"
    }

    case "ta": {
      return "Tamil"
    }

    case "tg": {
      return "Tajik"
    }

    case "th": {
      return "Thai"
    }

    case "tr": {
      return "Turkish"
    }

    case "tt": {
      return "Tatar"
    }

    case "ug": {
      return "Uighur"
    }

    case "ur": {
      return "Urdu"
    }

    case "uz": {
      return "Uzbek"
    }

    case "zh": {
      return "Chinese"
    }
  }

  return "Other"
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function groupBy<T extends Record<string, any>>( array: T[], key: string ): { [ key: string ]: T[] } {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return array.reduce( ( group: { [ key: string ]: T[] }, value ) => {
    const groupKey = value[ key ] as string
    if( ! group[ groupKey ] ) {
      group[ groupKey ] = []
    }
    group[ groupKey ].push( value )
    return group
  }, {} )
}

export function isRtlLanguage( code: string ): boolean {
  if( RTL_LANGUAGE_CODES.includes( code ) ) {
    return true
  }

  return false
}

export function setItemInStorage<T>( key: string, object: T ): Promise<T | null> {
  return localforage.setItem<T>( key, object )
    .catch( ( err ) => {
      logError( err )
      return null
    } )
}


