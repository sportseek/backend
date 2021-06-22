import { Request, Response, NextFunction } from "express"
import NotificationModel from "../../models/notification/Notification"
import Arena from "../../models/user/ArenaModel"
import Player from "../../models/user/PlayerModel"
import { getUserId } from "../../utility/helperFucntions/helperFunctions"

export const createNotification = async (
  creatorId: string,
  receiverId: string,
  type: string,
  description: string,
  playerToArena: boolean,
  next: NextFunction
) => {
  try {
    if (playerToArena) {
      const creator = await Player.findById(creatorId)
      const receiver = await Arena.findById(receiverId)

      if (creator && receiver) {
        const notification = new NotificationModel({
          creatorId: creatorId,
          creatorName: `${creator.firstName} ${creator.lastName}`,
          receiverId: receiverId,
          receiverName: receiver.arenaName,
          type: type,
          description: description,
          createdAt: new Date().toISOString(),
          unreadStatus: true,
        })

        const result = await notification.save()
        if (result) return true
        else return false
      }
    } else {
      const creator = await Arena.findById(creatorId)
      const receiver = await Player.findById(receiverId)

      if (creator && receiver) {
        const notification = new NotificationModel({
          creatorId: creatorId,
          creatorName: creator.arenaName,
          receiverId: receiverId,
          receiverName: `${receiver.firstName} ${receiver.lastName}`,
          type: type,
          description: description,
          createdAt: new Date().toISOString(),
          unreadStatus: true,
        })

        const result = await notification.save()
        if (result) return true
        else return false
      }
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pageNumber = req.params.pageNumber
  try {
    const userId = getUserId(req)
    const notificationLimit = 5
    const showNotificationNumber = notificationLimit * +pageNumber

    const notifications = await NotificationModel.find({ receiverId: userId })
      .limit(showNotificationNumber)
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      notifications: notifications,
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
