import { Response } from "express"
import { Collection, Cursor, FilterQuery } from "mongodb"

import { MongoDbException } from "./error.helper"

export interface Pagination {
  count: number
  last_page?: number
  next_page?: number | null
  page: number
  page_start?: number
  page_end?: number
  per_page: number
  prev_page?: number | null
}

export interface PaginationOptions {
  page: number
  per_page: number
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
    res.setHeader( "Per-Page", pagination.per_page )
    res.setHeader( "Page", pagination.page )

    if( pagination.next_page ) {
      res.setHeader( "Next-Page", pagination.next_page )
    }

    if( pagination.prev_page ) {
      res.setHeader( "Previous-Page", pagination.prev_page )
    }

    return results.items
  }
}

export function getPaginationOptions( query: { page?: string, per_page?: string } ): PaginationOptions {
  const { page, per_page } = query

  return {
    page: parseInt( page, 10 ) || 1,
    per_page: parseInt( per_page, 10 ) || 12,
  } as PaginationOptions
}

export async function getPaginationResults<T, U>( collection: Collection<T>, query: FilterQuery<T>, options: PaginationOptions, fromDocument: ( doc: T ) => U ) {
  const skip = ( options.page - 1 ) * options.per_page
  const cursor: Cursor<T> = collection.find<T>( query ).skip( skip ).limit( options.per_page )

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
    per_page: options.per_page || 12,
  }

  pagination.page_start = ( pagination.page - 1 ) * pagination.per_page + 1
  pagination.page_end = Math.min( pagination.page_start + pagination.per_page - 1, pagination.count )
  pagination.last_page = Math.ceil( pagination.count / pagination.per_page )
  pagination.prev_page = pagination.page > 1 ? pagination.page - 1 : null
  pagination.next_page = pagination.page < pagination.last_page ? pagination.page + 1 : null

  return {
    items: docs.map( fromDocument ),
    pagination,
  } as PaginationResults<U>
}