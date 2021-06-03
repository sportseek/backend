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
  const address = req.body.address
  const phone = req.body.phone

  try {
    const arenaExists = await ArenaModel.findOne({ email: email })

    if (!arenaExists) {
      const hashedPw = await bcryptjs.hash(
        password,
        parseInt(process.env.PASSWORD_SALT as string)
      )
      console.log(process.env.PASSWORD_SALT)
      const arena = new ArenaModel({
        arenaName,
        email,
        password: hashedPw,
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
          result: {
            userId: result._id,
            token: token,
            type: "arena",
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
