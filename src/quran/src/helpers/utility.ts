const ESCAPE_REGEX = /([.*+?^=!:${}()|\[\]\/\\])/g

export function getLanguageLabel( code: string ) {
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
      return "Divehi"
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

export function escapeRegex( string: string ){
  return string.replace( ESCAPE_REGEX, "\\$1" )
}

export function getObjectFromLocalStorage<T>( key: string ) {
  try {
    return localStorage.getItem( key ) != null ? JSON.parse( localStorage.getItem( key ) as string ) as T : null
  } catch( exception ) {
    console.error( "Problem storing in localStorage", exception )
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function groupBy( array: any[], key: string ) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return array.reduce( ( group:{ [ key: string ]: any[] }, value ) => {
    const groupKey = value[ key ] as string
    if( ! group[ groupKey ] ) {
      group[ groupKey ] = []
    }
    group[ groupKey ].push( value )
    return group
  }, {} )
}

export function setObjectInLocalStorage<T>( key: string, object: T ) {
  try {
    localStorage.setItem( key, JSON.stringify( object ) )
  } catch( exception ) {
    console.error( "Problem storing in localStorage", exception )
  }
}


