import {
  PLAYER_EMAIL_MIN,
  PLAYER_EMAIL_MAX,
  PLAYER_PASSWORD_MIN,
  PLAYER_PASSWORD_MAX,
} from "../../utility/constants/playerConstants"
import { Request, Response, NextFunction } from "express"
import bcryptjs from "bcryptjs"
import jsonwebtoken from "jsonwebtoken"
import { inputValidator } from "../../utility/inputValidators"
import ArenaModel, { IArena } from "../../models/user/ArenaModel"
import PlayerModel, { IPlayer } from "../../models/user/PlayerModel"

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email
  const password = req.body.password

  let loggedInPlayer: IPlayer
  let loggedInArena: IArena
  let isEqualPassword: boolean
  try {
    const inputs = [
      {
        fieldValue: email,
        fieldName: "email",
        validations: ["required"],
        minLength: PLAYER_EMAIL_MIN,
        maxLength: PLAYER_EMAIL_MAX,
      },
      {
        fieldValue: password,
        fieldName: "password",
        validations: ["required"],
        minLength: PLAYER_PASSWORD_MIN,
        maxLength: PLAYER_PASSWORD_MAX,
      },
    ]
    const errorsObject = inputValidator(inputs)
    if (errorsObject.hasError) {
      return res.status(422).json({
        success: false,
        errors: errorsObject.errors,
      })
    }

    const player = await PlayerModel.findOne({ email: email })
    const arena = await ArenaModel.findOne({ email: email })

    if (arena) {
      loggedInArena = arena
      isEqualPassword = await bcryptjs.compare(password, loggedInArena.password)

      if (!isEqualPassword) {
        return res.status(422).json({
          success: false,
          errors: ["Password did not match"],
        })
      }

      const token = jsonwebtoken.sign(
        {
          userId: loggedInArena._id.toString(),
        },
        process.env.TOKEN_KEY as string,
        {
          expiresIn: process.env.TOKEN_KEY_EXPIRATION as string,
        }
      )

      return res.status(200).json({
        success: true,
        result: {
          userId: loggedInArena._id,
          token: token,
          type: loggedInArena.type,
        },
      })
    } else if (player) {
      loggedInPlayer = player
      isEqualPassword = await bcryptjs.compare(
        password,
        loggedInPlayer.password
      )

      if (!isEqualPassword) {
        return res.status(422).json({
          success: false,
          errors: ["Password did not match"],
        })
      }

      const token = jsonwebtoken.sign(
        {
          userId: loggedInPlayer._id.toString(),
        },
        process.env.TOKEN_KEY as string,
        {
          expiresIn: process.env.TOKEN_KEY_EXPIRATION as string,
        }
      )

      return res.status(200).json({
        success: true,
        result: {
          userId: loggedInPlayer._id,
          token: token,
          type: loggedInPlayer.type,
        },
      })
    } else {
      return res.status(422).json({
        success: false,
        errors: ["There is no such user with this email"],
      })
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
