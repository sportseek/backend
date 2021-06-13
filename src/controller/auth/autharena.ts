import {
  MONTHLY_FEE_MIN,
  DEFAULT_PROFILE_IMAGE,
} from "../../utility/constants/arenaConstants"
import { Request, Response, NextFunction } from "express"
import bcryptjs from "bcryptjs"
import jsonwebtoken from "jsonwebtoken"
import ArenaModel from "../../models/user/ArenaModel"

export const arenaSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const arenaName = req.body.arenaName
  const email = req.body.email
  const password = req.body.password
  const phone = req.body.phone
  const type = "arena"

  try {
    const arenaExists = await ArenaModel.findOne({ email: email })

    if (!arenaExists) {
      const hashedPw = await bcryptjs.hash(
        password,
        parseInt(process.env.PASSWORD_SALT as string)
      )
      const arena = new ArenaModel({
        arenaName,
        email,
        type,
        password: hashedPw,
        phone,
        monthlyFee: MONTHLY_FEE_MIN,
        arenaImageUrl: DEFAULT_PROFILE_IMAGE,
        bankAccount: " ",
        location: { lat: 48.137154, lng: 11.576124 },
      })
      const result = await arena.save()

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
          success: false,
          errors: ["Could not create an arena account"],
        })
      }
    } else {
      return res.status(422).json({
        success: false,
        errors: ["Arena account already exists."],
      })
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
