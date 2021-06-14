import jwt_decode from "jwt-decode"
import { Request } from "express"

export const getUserId = (req: Request) => {
  const authHeader = req.get("Authorization")
  let userId = null
  if (authHeader) {
    const token = authHeader.split(" ")[1]
    const decoded: any = jwt_decode(token)
    userId = decoded.userId
  }

  return userId
}

export const getUserType = (req: Request) => {
  const authHeader = req.get("Authorization")
  let userType = null
  if (authHeader) {
    const token = authHeader.split(" ")[1]
    const decoded: any = jwt_decode(token)
    userType = decoded.userType
  }

  return userType
}
