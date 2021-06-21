import { Request, Response, NextFunction } from "express"
import PlayerModel from "../../models/user/PlayerModel"
import { clearImage } from "../../utility/helperFucntions/helperFunctions"
import { Error } from "mongoose"
import formatValidationErrors from "../../utility/formValidator"

const cloudinary = require("cloudinary").v2

const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const player = await PlayerModel.findById(id)

    if (player === null)
      return res.status(404).json({
        error: "Not found",
        message: "The resource does not exist",
      })
    else
      return res.status(200).json({
        success: true,
        user: player,
      })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body is empty",
    })
  }

  try {
    const player = await PlayerModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).exec()

    return res.status(200).json({ success: true, user: player })
  } catch (err) {
    if (err instanceof Error.ValidationError) {
      const errorResponse = formatValidationErrors(err)
      return res.status(422).json(errorResponse)
    }
    next(err)
  }
}

const updateProfilePic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id
    if (userId) {
      const image = req.file.path
      cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
      })
      const imageUrl = await cloudinary.uploader
        .upload(image, { public_id: userId })
        .then((res: any) => res.secure_url)
        .catch((err: any) => {
          console.log(err)
          return null
        })

      if (imageUrl) {
        clearImage(image)
        const user = await PlayerModel.findByIdAndUpdate(
          userId,
          { profileImageUrl: imageUrl },
          {
            new: true,
            runValidators: true,
          }
        ).exec()
        if (user) {
          return res.status(200).json({ success: true, user })
        } else {
          return res.status(422).json({
            success: false,
            errors: ["Could not update the user"],
          })
        }
      } else {
        return res.status(422).json({
          success: false,
          errors: ["Could not connect to image server, try again"],
        })
      }
    } else {
      return res.status(422).json({
        success: false,
        errors: ["The user does not exist"],
      })
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export default { findById, update, updateProfilePic }
