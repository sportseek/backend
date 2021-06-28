import { Request, Response, NextFunction } from "express"
import ArenaControllar from "../controller/user/Arena"
import PlayerController from "../controller/user/Player"

import {
  getUserId,
  getUserType,
} from "../utility/helperFucntions/helperFunctions"

const selectController = (req: Request, res: Response, next: NextFunction) => {
  const userType = getUserType(req)

  const userId = getUserId(req)

  req.params.id = userId

  const type = userType || req.body.type

  res.locals.controller = type === "player" ? PlayerController : ArenaControllar
  next()
}

export default selectController
