import { Exception } from '@adonisjs/core/exceptions'

function isNodeSystemError(error: Error): error is NodeJS.ErrnoException {
  return typeof error === 'object' && 'code' in error && 'errno' in error && 'syscall' in error
}

export default function customErrorHandler(
  error: unknown,
  notFoundCustomMessage = 'The requested resource could not be found'
): never {
  if (error instanceof Error && isNodeSystemError(error)) {
    const errorInstance =
      error.code === 'ENOENT'
        ? new Exception(notFoundCustomMessage, {
            code: 'E_NOT_FOUND',
            status: 404,
          })
        : new Exception(`A system error has occurred: ${error.name} -> ${error.message}`, {
            code: error.code,
            status: error.errno,
          })
    throw errorInstance
  } else if (error instanceof Error && error instanceof Exception) {
    throw error
  } else if (error instanceof Error) {
    const errorCause = error.cause ?? 'No cause provided'
    throw new Exception(
      `An error has occurred: ${error.name} -> ${error.message}\nCause: ${JSON.stringify(errorCause)}`
    )
  } else {
    throw new Exception('An unknown error has occurred')
  }
}
