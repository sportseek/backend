import { Request, Response, NextFunction } from "express"
import bcryptjs from "bcryptjs"
import jsonwebtoken from "jsonwebtoken"
import ArenaModel from "../../models/user/ArenaModel"
import PlayerModel from "../../models/user/PlayerModel"

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email
  const password = req.body.password

  try {
    const player = await PlayerModel.findOne({ email: email })
    const arena = await ArenaModel.findOne({ email: email })

    const user = player || arena

    if (user) {
      const isEqualPassword = await bcryptjs.compare(password, user.password)

      if (!isEqualPassword) {
        return res.status(422).json({ password: "Password did not match" })
      }

      const token = jsonwebtoken.sign(
        {
          userId: user._id,
          userType: user.type,
        },
        process.env.TOKEN_KEY as string,
        {
          expiresIn: process.env.TOKEN_KEY_EXPIRATION as string,
        }
      )

      return res.status(200).json({
        success: true,
        result: {
          token: token,
          userType: user.type,
        },
      })
    } else {
      return res
        .status(422)
        .json({ email: "There is no such user with this email" })
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
