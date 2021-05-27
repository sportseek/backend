import {
  PLAYER_EMAIL_MIN,
  PLAYER_EMAIL_MAX,
  PLAYER_PASSWORD_MIN,
  PLAYER_PASSWORD_MAX,
  DEFAULT_PROFILE_IMAGE,
} from "./../../utility/constants/playerConstants"
import { IPlayer } from "./../../models/auth/Player"
import express, { Request, Response, NextFunction } from "express"
import bcryptjs from "bcryptjs"
import jsonwebtoken from "jsonwebtoken"
import Player from "../../models/auth/Player"
import dotenv from "dotenv"
import { inputValidator } from "../../utility/inputValidators"

dotenv.config()

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const email = req.body.email
  const password = req.body.password
  const address = req.body.address
  const phone = req.body.phone

  try {
    const playerExists = await Player.findOne({ email: email })

    if (!playerExists) {
      const hashedPw = await bcryptjs.hash(
        password,
        parseInt(process.env.PASSWORD_SALT as string)
      )
      console.log(process.env.PASSWORD_SALT)
      const player = new Player({
        firstName,
        lastName,
        email,
        hashedPw,
        address,
        phone,
        wallet: 0,
        profileImageUrl: DEFAULT_PROFILE_IMAGE,
        registeredEvents: [],
        interestedEvents: [],
      })
      const result = await player.save()

      if (result) {
        const token = jsonwebtoken.sign(
          {
            userId: result._id.toString(),
          },
          process.env.TOKEN_KEY as string,
          {
            expiresIn: process.env.TOKEN_KEY_EXPIRATION as string,
          }
        )

        return res.status(201).json({
          success: true,
          Result: {
            userId: result._id,
            token: token,
          },
        })
      } else {
        return res.status(201).json({
          success: false,
          Errors: ["Could not create a user"],
        })
      }
    } else {
      return res.status(422).json({
        success: false,
        Errors: ["User already exists."],
      })
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email
  const password = req.body.password

  let loggedInUser: IPlayer
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
        Errors: errorsObject.errors,
      })
    }

    const player = await Player.findOne({ email: email })
    if (!player) {
      return res.status(422).json({
        IsSuccess: false,
        Errors: ["There is no such user with this email"],
      })
    } else {
      loggedInUser = player
      isEqualPassword = await bcryptjs.compare(password, loggedInUser.password)

      if (!isEqualPassword) {
        return res.status(422).json({
          success: false,
          Errors: ["Password did not match"],
        })
      }

      const token = jsonwebtoken.sign(
        {
          userId: loggedInUser._id.toString(),
        },
        process.env.TOKEN_KEY as string,
        {
          expiresIn: process.env.TOKEN_KEY_EXPIRATION as string,
        }
      )

      return res.status(200).json({
        success: true,
        Result: {
          userId: loggedInUser._id,
          token: token,
        },
      })
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
