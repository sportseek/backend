import { Request, Response, NextFunction } from "express"
import ArenaModel from "../../models/user/ArenaModel"

const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const arena = await ArenaModel.findById(id)

    if (arena === null)
      return res.status(404).json({
        error: "Not found",
        message: "The resource does not exist",
      })
    else
      return res.status(200).json({
        success: true,
        user: arena,
      })
  } catch (err) {
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    })
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
    const arena = await ArenaModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).exec()

    return res.status(200).json({ success: true, user: arena })
  } catch (err) {
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    })
  }
}

export default { findById, update }
