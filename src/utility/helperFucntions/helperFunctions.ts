// eslint-disable-next-line camelcase
import jwt_decode from "jwt-decode"
import { Request } from "express"

import path from "path"
import fs from "fs"
import cloudinary from "cloudinary"

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
  fs.unlink(filePath, (err) => console.log(err))
}

export const makeDir = (filePath: string) =>
  fs.existsSync(filePath)
    ? ""
    : fs.mkdir(filePath, () => console.log(filePath + " folder created"))

export const uploadImage = async (imageFilePath: string) => {
  const imageUrl = imageFilePath
  let uploadedImageUrl = ""
  let uploadImageId = ""

  cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  })

  await cloudinary.v2.uploader
    .upload(imageUrl, {
      tags: "event_picture",
    })
    .then(function (image) {
      if (image) {
        console.log("image uploaded")
        uploadedImageUrl = image.url
        uploadImageId = image.public_id
      }
    })
    .catch(function (error) {
      console.log("error occured while uploading")
      console.log(error)
    })
  clearImage(imageUrl)

  return {
    uploadedImageUrl,
    uploadImageId,
  }
}
