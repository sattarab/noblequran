import axios from "axios"

import { HttpError } from "./error"
interface HttpRequestData {
  [ key: string ]: number | string | HttpRequestData
}

export interface HttpRequestOption {
  method: HttpMethod
  url: string
  data?: HttpRequestData
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

const DEFAULT_ERROR_MESSAGE = "Unknown error"

const axiosInstance = axios.create()
axiosInstance.defaults.headers.common[ "Accept" ] = "application/json"

export function getBaseUrl(): string {
  if( process.env[ "REACT_APP_ENV" ] === "dev" ) {
    return "https://local.noblequran.cloud"
  } else if( process.env[ "REACT_APP_ENV" ] === "stg" ) {
    return "https://stage.noblequran.cloud"
  }

  return "https://noblequran.cloud"
}

export async function sendHttpRequest<T>( options: HttpRequestOption ): Promise<T> {
  const axiosOptions = {
    ...options,
  }

  const response = await axiosInstance( axiosOptions )
    .catch(
      ( error ) => {
        if( error.response ) {
          const { data } = error.response
          const message = data.message || DEFAULT_ERROR_MESSAGE
          throw new HttpError( message, { statusCode: error.response.status } )
        }

        throw new Error( DEFAULT_ERROR_MESSAGE )
      },
    )

  return response.data as T
}
