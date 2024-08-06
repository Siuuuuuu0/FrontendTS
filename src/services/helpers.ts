import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error
}

function isErrorWithMessage(
  error: unknown,
): error is { message: string } {
  return (
    typeof error === 'object' &&
    error != null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  )
}

export type ErrorType = FetchBaseQueryError | SerializedError | undefined 

export const handleError = (err: ErrorType ): string => {
    if (isFetchBaseQueryError(err)) {
        const message = 'error' in err ? err.error : JSON.stringify(err.data)
            return message
    } else if (isErrorWithMessage(err)) {
        return err.message
    }
    else return ''
}

export type AtLeastOne<T> = {
  [K in keyof T]: Pick<T, K> & Partial<Omit<T, K>>;
}[keyof T];


// Type Parameter T:

// AtLeastOne is a generic type that takes a type parameter T.
// Mapped Type:

// [K in keyof T]: is a mapped type. It iterates over each key K in the type T.
// Pick and Partial:

// Pick<T, K>: This utility type creates a new type by picking the key K from T and making it required.
// Partial<Omit<T, K>>: This creates a new type by omitting the key K from T and making all other keys optional.
// Pick<T, K> & Partial<Omit<T, K>>: This creates a new type where the key K is required, and all other keys are optional. The & operator combines these two types.
// Union of All Possible Mapped Types:

// { [K in keyof T]: ... }[keyof T]: This constructs a union type of all the possible mapped types created in the previous step.
// By indexing the mapped type with [keyof T], we get a union of all the types where each key K from T is made required one by one.

export type User = {
  username : string, 
  email : string, 
  firstName : string, 
  lastName : string, 
  roles : {
      [key:string]: number
  }, 
  _id : string, 
  googleId?:string,
  logIns?:string[], 
  [key:string]:any
};