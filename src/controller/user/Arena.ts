import { Request, Response, NextFunction } from "express"
import ArenaModel from "../../models/user/ArenaModel"
import cloudinary from "cloudinary"
import { clearImage } from "../../utility/helperFucntions/helperFunctions"

const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const arena = await ArenaModel.findById(id)

    if (arena === null)
      return res.status(404).json({
        error: "Not found",
        message: "The resource does not exist",
      })
    else
      return res.status(200).json({
        success: true,
        user: arena,
      })
  } catch (err) {
    console.log(err)
    next(err)
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
    const arena = await ArenaModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).exec()

    return res.status(200).json({ success: true, user: arena })
  } catch (err) {
    console.log(err)
    next(err)
  }
}

const updateArenaImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await ArenaModel.findById(req.params.id)
    if (user) {
      const imageUrl = req.file.path
      let uploadedImageUrl = ""
      let uploadImageId = ""

      cloudinary.v2.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
      })

      if (user.profileImageId) {
        cloudinary.v2.uploader
          .destroy(user.profileImageId)
          .then(function (result) {
            console.log("image deleted")
            console.log(result)
          })
          .catch(function (error) {
            console.log("error occured while deleting")
            console.log(error)
          })
      }
      await cloudinary.v2.uploader
        .upload(imageUrl, {
          tags: "profile_picture",
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
      user.profileImageUrl = uploadedImageUrl
      user.profileImageId = uploadImageId

      const result = await user.save()

      if (result) {
        return res.status(200).json({
          success: true,
          user: result,
        })
      } else {
        return res.status(422).json({
          IsSuccess: false,
          Errors: ["Could not update the user"],
        })
      }
    } else {
      return res.status(422).json({
        IsSuccess: false,
        Errors: ["Could not update the user"],
      })
    }
  } catch (err) {
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    })
  }
}

export default { findById, update, updateProfilePic: updateArenaImage }
