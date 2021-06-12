import { Request, Response, NextFunction } from "express"
import EventModel from "../../models/event/EventModel"
import ArenaModel from "../../models/user/ArenaModel"

export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id
    const event = await EventModel.findById(id)

    if (event === null)
      return res.status(404).json({
        success: false,
        error: "Not found",
        message: "The resource does not exist",
      })
    else
      return res.status(200).json({
        success: true,
        event,
      })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const eventToCreate = req.body
    // const doc = new EventModel(eventToCreate)
    // const newEvent = await doc.save()
    const arenaOwner = await ArenaModel.findById(req.body.creator)

    if (arenaOwner) {
      const newEvent = new EventModel({
        ...req.body,
        location: arenaOwner.location ? arenaOwner.location : {},
        registeredPlayers: [],
        interestedPlayers: [],
        revenue: 0,
        address: arenaOwner.address ? arenaOwner.address : {},
      })

      const result = await newEvent.save()

      return res.status(200).json({
        success: true,
        eventId: result._id,
      })
    }
  } catch (err) {
    console.log(err)
    next(err)
  }
}
