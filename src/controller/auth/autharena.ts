import {
  ARENA_NAME_MAX,
  ARENA_NAME_MIN,
  ARENA_EMAIL_MAX,
  ARENA_EMAIL_MIN,
  ARENA_PASSWORD_MAX,
  ARENA_PASSWORD_MIN,
  ADDRESS_MIN_LENGTH,
  PHONE_MIN_LENGTH,
  MONTHLY_FEE_MIN,
  DEFAULT_PROFILE_IMAGE,
} from "./../../utility/constants/arenaConstants"
import { IArena } from "./../../models/auth/Arena"
import express, { Request, Response, NextFunction } from "express"
import bcryptjs from "bcryptjs"
import jsonwebtoken from "jsonwebtoken"
import Arena from "../../models/auth/Arena"
import dotenv from "dotenv"
import { inputValidator } from "../../utility/inputValidators"

dotenv.config()

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const arenaName = req.body.arenaName
  const email = req.body.email
  const password = req.body.password
  const address = req.body.address
  const phone = req.body.phone

  try {
    const arenaExists = await Arena.findOne({ email: email })

    if (!arenaExists) {
      const hashedPw = await bcryptjs.hash(
        password,
        parseInt(process.env.PASSWORD_SALT as string)
      )
      console.log(process.env.PASSWORD_SALT)
      const arena = new Arena({
        arenaName,
        email,
        hashedPw,
        address,
        phone,
        location: [],
        monthlyFee: MONTHLY_FEE_MIN,
        arenaImageUrl: DEFAULT_PROFILE_IMAGE,
        bankAccount: " ",
      })
      const result = await arena.save()

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
          Errors: ["Could not create an arena account"],
        })
      }
    } else {
      return res.status(422).json({
        success: false,
        Errors: ["Arena account already exists."],
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

  let loggedInUser: IArena
  let isEqualPassword: boolean
  try {
    const inputs = [
      {
        fieldValue: email,
        fieldName: "email",
        validations: ["required"],
        minLength: ARENA_EMAIL_MIN,
        maxLength: ARENA_EMAIL_MAX,
      },
      {
        fieldValue: password,
        fieldName: "password",
        validations: ["required"],
        minLength: ARENA_PASSWORD_MIN,
        maxLength: ARENA_PASSWORD_MAX,
      },
    ]
    const errorsObject = inputValidator(inputs)
    if (errorsObject.hasError) {
      return res.status(422).json({
        success: false,
        Errors: errorsObject.errors,
      })
    }

    const arena = await Arena.findOne({ email: email })
    if (!arena) {
      return res.status(422).json({
        success: false,
        Errors: ["There is no such user with this email"],
      })
    } else {
      loggedInUser = arena
      isEqualPassword = await bcryptjs.compare(password, loggedInUser.password)

      if (!isEqualPassword) {
        return res.status(422).json({
          success: false,
          Errors: ["Password did not match"],
        })
      }

      const token = jsonwebtoken.sign(
        {
          UserId: loggedInUser._id.toString(),
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
