import express, { Request, Response, NextFunction } from "express"
import ArenaControllar from "../controller/user/Arena"

import selectController from "../middleware/selectUser"

const router = express.Router()

router.get(
  "/",
  selectController,
  (req: Request, res: Response, next: NextFunction) => {
    res.locals.controller.findById(req, res, next)
  }
)

router.put(
  "/update/:id",
  selectController,
  (req: Request, res: Response, next: NextFunction) => {
    res.locals.controller.update(req, res, next)
  }
)

router.put("/updateArenaImage/:id", ArenaControllar.updateArenaImage)

export default router
