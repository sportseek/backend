import { Request, Response, NextFunction } from "express"
import EventModel from "../../models/event/EventModel"
import ArenaModel from "../../models/user/ArenaModel"
import PlayerModel from "../../models/user/PlayerModel"
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
    const user = await res.locals.model.findById(req.body.creator)

    if (user) {
      const newEvent = new EventModel({
        ...req.body,
        location: user.location ? user.location : {},
        registeredPlayers: [],
        interestedPlayers: [],
        revenue: 0,
        address: user.address ? user.address : {},
        status: "active",
        eventImageUrl: user.profileImageUrl,
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
    const userId = getUserId(req)
    const arenaOwner = await ArenaModel.findById(req.body.creator)
    const event = await EventModel.findById(req.params.id)

    if (arenaOwner && event && userId === event.creator) {
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
    } else {
      return res.status(422).json({
        success: false,
        error: "Could not update the event",
      })
    }
  } catch (err) {
    console.log(err)
    next(err)
  }
}

export const cancelEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserId(req)
    const event = await EventModel.findById(req.params.id)

    if (event) {
      if (userId === event.creator) {
        event.status = "cancelled"

        const result = await event.save()
        return res.status(200).json({
          success: true,
          eventId: result._id,
        })
      } else {
        return res.status(422).json({
          success: false,
          error: "You can not cancel the event",
        })
      }
    } else {
      return res.status(422).json({
        success: false,
        error: "No event found",
      })
    }
  } catch (err) {
    console.log(err)
    next(err)
  }
}

export const fetchEventList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id
    if (userId) {
      const events = await EventModel.find({ creator: userId })
      return res.status(200).json({
        success: true,
        eventList: events,
      })
    } else {
      return res.status(422).json({
        success: false,
        error: "Could not find the user for the arena",
      })
    }
  } catch (err) {
    next(err)
  }
}

export const fetchAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const searchParams: any = req.body
  try {
    const events = await EventModel.find(
      searchParams.sportType ? { sportType: searchParams.sportType } : {}
    )
    return res.status(200).json({
      success: true,
      eventList: events,
    })
  } catch (err) {
    next(err)
  }
}

export const updateInterested = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserId(req)
    const interested = req.body.interested
    const player = await PlayerModel.findById(userId)
    const event = await EventModel.findById(req.params.id)

    if (player && event) {
      if (interested) {
        player.interestedEvents.push(event._id)
        event.interestedPlayers.push(player._id)
      } else {
        player.interestedEvents = player.interestedEvents.filter(
          (item) => item != event._id
        )
        event.interestedPlayers = event.interestedPlayers.filter(
          (item) => item != userId
        )
      }

      const res1 = await player.save()
      const res2 = await event.save()

      if (res1 && res2) {
        return res.status(200).json({
          success: true,
          event: res2,
        })
      } else {
        return res.status(422).json({
          success: false,
          error: "Could not update the event",
        })
      }
    } else {
      return res.status(422).json({
        success: false,
        error: "Could not update the event",
      })
    }
  } catch (err) {
    console.log(err)
    next(err)
  }
}
