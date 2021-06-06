import { Request, Response, NextFunction } from "express"
import PlayerModel from "../../models/user/PlayerModel"

const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const player = await PlayerModel.findById(id)

    if (player === null)
      return res.status(404).json({
        error: "Not found",
        message: "The resource does not exist",
      })
    else
      return res.status(200).json({
        success: true,
        user: player,
      })
  } catch (error) {
    console.log(error)
    next(error)
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
    const player = await PlayerModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).exec()

    return res.status(200).json({ success: true, user: player })
  } catch (err) {
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    })
  }
}

export default { findById, update }
