import { Error } from "mongoose"

const formatValidationErrors = (
  mongooseError: any,
  errorResponse: Record<string, any>
) => {
  for (const prop of Object.getOwnPropertyNames(errorResponse)) {
    delete errorResponse[prop]
  }

  const errors = mongooseError.errors

  Object.keys(errors).forEach((key) => {
    const error = errors[key]
    if (error instanceof Error.ValidatorError) {
      const { message = "" } = error
      errorResponse[key] = message
    } else if (error instanceof Error.CastError) {
      //
    }
  })

  return errorResponse
}

export default formatValidationErrors
