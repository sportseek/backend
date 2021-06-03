import express, { Request, Response, NextFunction } from "express"
import ArenaControllar from "../controller/user/Arena"
import PlayerController from "../controller/user/Player"

const router = express.Router()

const selectController = (req: Request, res: Response, next: NextFunction) => {
  res.locals.controller =
    req.params.type === "player" ? PlayerController : ArenaControllar
  next()
}

router.get(
  "/fetchById/:type/:id",
  selectController,
  (req: Request, res: Response, next: NextFunction) => {
    res.locals.controller.findById(req, res, next)
  }
)

export default router
