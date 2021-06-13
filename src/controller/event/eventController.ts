import { Request, Response, NextFunction } from "express"
import EventModel from "../../models/event/EventModel"
import ArenaModel from "../../models/user/ArenaModel"
import { getUserId } from "../../utility/helperFucntions/helperFunctions"

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

export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const arenaOwner = await ArenaModel.findById(req.body.creator)
    const event = await EventModel.findById(req.params.id)

    if (arenaOwner && event) {
      const updatedEvent = await EventModel.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          location: event.location ? event.location : {},
          registeredPlayers: event.registeredPlayers,
          interestedPlayers: event.interestedPlayers,
          revenue: event.revenue,
          address: event.address ? event.address : {},
        },
        {
          new: true,
          runValidators: true,
        }
      ).exec()

      if (updatedEvent) {
        return res.status(200).json({
          success: true,
          eventId: updatedEvent._id,
        })
      } else {
        return res.status(422).json({
          success: false,
          error: "Could not update the event",
        })
      }
    }
  } catch (err) {
    console.log(err)
    next(err)
  }
}

export const getArenaEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserId(req);
    if (userId) {
      const arenaEvents = await EventModel.find({ creator: userId })

      return res.status(200).json({
        success: true,
        arenaEvents: arenaEvents,
      })
    }
    else {
      return res.status(422).json({
        success: false,
        error: "Could not find the user for the arena",
      })
    }
  } catch (err) {
    next(err)
  }
}
