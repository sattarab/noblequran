import axios from "axios"

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

export async function sendHttpRequest<T>( options: HttpRequestOption ) {
  const axiosOptions = {
    ...options,
  }

  const response = await axiosInstance( axiosOptions )
    .catch(
      ( error ) => {
        if( error.response ) {
          const { data } = error.response
          const message = data.message || DEFAULT_ERROR_MESSAGE
          throw new Error( message )
        }

        throw new Error( DEFAULT_ERROR_MESSAGE )
      },
    )

  return response.data as T
}