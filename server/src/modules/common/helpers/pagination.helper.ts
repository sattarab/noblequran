import type { Response } from "express"
import type { Collection, Cursor, FilterQuery } from "mongodb"

import { MongoDbException } from "./error.helper"

export interface Pagination {
  count: number
  lastPage?: number
  nextPage?: number | null
  page: number
  pageStart?: number
  pageEnd?: number
  perPage: number
  prevPage?: number | null
}

export interface PaginationOptions {
  page: number
  perPage: number
  project?: { [ key: string ]: number }
  sort?: [ string, number ][]
}

export interface PaginationResults<U> {
  items: U[]
  pagination: Pagination
}

export function addPagination<T>( res: Response ) {
  return ( results: PaginationResults<T> ) => {
    const { pagination } = results
    res.setHeader( "Total-Count", pagination.count || 0 )
    res.setHeader( "Per-Page", pagination.perPage )
    res.setHeader( "Page", pagination.page )

    if( pagination.nextPage ) {
      res.setHeader( "Next-Page", pagination.nextPage )
    }

    if( pagination.prevPage ) {
      res.setHeader( "Previous-Page", pagination.prevPage )
    }

    return results.items
  }
}

export function getPaginationOptions( query: { page?: string, perPage?: string } ): PaginationOptions {
  const { page, perPage } = query

  return {
    page: parseInt( page, 10 ) || 1,
    perPage: parseInt( perPage, 10 ) ?? 12,
  } as PaginationOptions
}

export async function getPaginationResults<T, U>(
  collection: Collection<T>,
  query: FilterQuery<T>,
  options: PaginationOptions,
  fromDocument: ( doc: T ) => U
): Promise<PaginationResults<U>> {
  const skip = ( options.page - 1 ) * options.perPage
  const cursor: Cursor<T> = collection.find<T>( query, { skip, limit: options.perPage } )

  if( options.project ) {
    cursor.project( options.project )
  }

  if( options.sort ) {
    cursor.sort( options.sort )
  }

  const results = await Promise.all( [
    cursor.toArray()
      .catch( ( err ) => { throw new MongoDbException( err ) } ),
    collection.countDocuments( query )
      .catch( ( err ) => { throw new MongoDbException( err ) } ),
  ] )

  const [ docs, count ] = results
  const pagination: Pagination = {
    count,
    page: options.page || 1,
    perPage: options.perPage || 12,
  }

  pagination.pageStart = ( pagination.page - 1 ) * pagination.perPage + 1
  pagination.pageEnd = Math.min( pagination.pageStart + pagination.perPage - 1, pagination.count )
  pagination.lastPage = Math.ceil( pagination.count / pagination.perPage )
  pagination.prevPage = pagination.page > 1 ? pagination.page - 1 : null
  pagination.nextPage = pagination.page < pagination.lastPage ? pagination.page + 1 : null

  return {
    items: docs.map( fromDocument ),
    pagination,
  } as PaginationResults<U>
}
