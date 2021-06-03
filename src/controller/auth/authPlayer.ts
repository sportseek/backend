import {
  PLAYER_EMAIL_MIN,
  PLAYER_EMAIL_MAX,
  PLAYER_PASSWORD_MIN,
  PLAYER_PASSWORD_MAX,
  DEFAULT_PROFILE_IMAGE,
} from "../../utility/constants/playerConstants"
import { IPlayer } from "../../models/auth/Player"
import express, { Request, Response, NextFunction } from "express"
import bcryptjs from "bcryptjs"
import jsonwebtoken from "jsonwebtoken"
import Player from "../../models/auth/Player"
import dotenv from "dotenv"
import { inputValidator } from "../../utility/inputValidators"

dotenv.config()

export const playerSignup = async (
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
        password: hashedPw,
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
          result: {
            userId: result._id,
            token: token,
            type: "player",
          },
        })
      } else {
        return res.status(201).json({
          success: false,
          errors: ["Could not create a user"],
        })
      }
    } else {
      return res.status(422).json({
        success: false,
        errors: ["User already exists."],
      })
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
