import { Error } from "mongoose"

const formatValidationErrors = (mongooseError: any) => {
  const errorResponse = {} as Record<string, any>
  const errors = mongooseError.errors

  Object.keys(errors).forEach((key) => {
    if (!key.includes(".")) {
      const error = errors[key]
      if (error.errors) {
        errorResponse[key] = formatValidationErrors(error)
      } else if (error instanceof Error.ValidatorError) {
        const { message = "" } = error
        errorResponse[key] = message
      } else if (error instanceof Error.CastError) {
        const { stringValue = "" } = error
        errorResponse[key] = stringValue
      }
    }
  })

  return errorResponse
}

export default formatValidationErrors
