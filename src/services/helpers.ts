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