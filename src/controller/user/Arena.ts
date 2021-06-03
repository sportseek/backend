import { Request, Response, NextFunction } from "express"
import Arena from "../../models/user/ArenaModel"

const findById = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  const arena = await Arena.findById(id)

  return res.status(200).json({
    success: true,
    user: arena,
  })
}

export default { findById }
