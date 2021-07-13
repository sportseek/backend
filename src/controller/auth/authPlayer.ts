import { Request, Response, NextFunction } from "express"
import bcryptjs from "bcryptjs"
import jsonwebtoken from "jsonwebtoken"
import PlayerModel from "../../models/user/PlayerModel"
import { Error } from "mongoose"
import formatValidationErrors from "../../utility/formValidator"
import { PLAYER_PASSWORD_MIN } from "../../utility/constants/playerConstants"

export const playerSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const email = req.body.email
  const password = req.body.password
  const phone = req.body.phone

  try {
    const playerExists = await PlayerModel.findOne({ email: email })

    if (!playerExists) {
      if (password.length < PLAYER_PASSWORD_MIN)
        return res
          .status(422)
          .json({ password: `Minimum length ${PLAYER_PASSWORD_MIN}` })

      const hashedPw = await bcryptjs.hash(
        password,
        parseInt(process.env.PASSWORD_SALT as string)
      )
      const player = new PlayerModel({
        firstName,
        lastName,
        email,
        password: hashedPw,
        phone,
      })
      const result = await player.save()

      if (result) {
        const token = jsonwebtoken.sign(
          {
            userId: result._id,
            userType: result.type,
          },
          process.env.TOKEN_KEY as string,
          {
            expiresIn: process.env.TOKEN_KEY_EXPIRATION as string,
          }
        )

        return res.status(201).json({
          success: true,
          result: {
            token: token,
            userType: result.type,
          },
        })
      } else {
        return res.status(201).json({
          errors: ["Could not create a user"],
        })
      }
    } else {
      return res.status(422).json({
        errors: ["User already exists."],
      })
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    if (err instanceof Error.ValidationError) {
      const errorResponse = formatValidationErrors(err)
      return res.status(422).json(errorResponse)
    }
    next(err)
  }
}
