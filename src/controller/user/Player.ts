import { Request, Response, NextFunction } from "express"
import Player from "../../models/auth/Player"

const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const playr = await Player.findById(id)

    return res.status(200).json({
      success: true,
      user: playr,
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export default { findById }
