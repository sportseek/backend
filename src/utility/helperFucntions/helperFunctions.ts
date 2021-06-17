import jwt_decode from "jwt-decode"
import { Request } from "express"

import path from "path"
import fs from "fs"

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

export const clearImage = (filePath: string) => {
  filePath = path.join(__dirname, "../../..", filePath)
  console.log(filePath)
  fs.unlink(filePath, (err) => console.log(err))
}

export const makeDir = (filePath: string) =>
  fs.existsSync(filePath)
    ? ""
    : fs.mkdir(filePath, () => console.log(filePath + " folder created"))
