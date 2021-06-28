import express, { Request, Response, NextFunction } from "express"
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
  "/update/",
  selectController,
  (req: Request, res: Response, next: NextFunction) => {
    res.locals.controller.update(req, res, next)
  }
)

router.put(
  "/updateProfilePic/",
  selectController,
  (req: Request, res: Response, next: NextFunction) => {
    res.locals.controller.updateProfilePic(req, res, next)
  }
)

router.get(
  "/findAll/",
  selectController,
  (req: Request, res: Response, next: NextFunction) => {
    res.locals.controller.findAll(req, res, next)
  }
)

router.put(
  "/addFriend/",
  selectController,
  (req: Request, res: Response, next: NextFunction) => {
    res.locals.controller.addFriend(req, res, next)
  }
)

router.put(
  "/removeFriends/",
  selectController,
  (req: Request, res: Response, next: NextFunction) => {
    res.locals.controller.removeFriend(req, res, next)
  }
)

router.get(
  "/findFriendById/:friendId",
  selectController,
  (req: Request, res: Response, next: NextFunction) => {
    res.locals.controller.findFriend(req, res, next)
  }
)

export default router
