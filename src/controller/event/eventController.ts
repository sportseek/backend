import { Request, Response, NextFunction } from "express"
import EventModel from "../../models/event/EventModel"
import ArenaModel from "../../models/user/ArenaModel"
import PlayerModel from "../../models/user/PlayerModel"
import {
  getUserId,
  uploadImage,
} from "../../utility/helperFucntions/helperFunctions"
import { createNotification } from "../notification/notificationController"
import Stripe from "stripe"
import dotenv from "dotenv"
import formatValidationErrors from "../../utility/formValidator"
import { Error } from "mongoose"

dotenv.config()

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
    console.log(req.body)
    const user = await ArenaModel.findById(req.body.creator)
    const imageUrl = req.file ? req.file.path : ""

    if (user) {
      let imageUploadDetails: any = null
      if (imageUrl) imageUploadDetails = await uploadImage(imageUrl)

      const newEvent = new EventModel({
        ...req.body,
        entryFee: +req.body.entryFee,
        maxPlayers: +req.body.maxPlayers,
        minPlayers: +req.body.minPlayers,
        location: user.location ? user.location : {},
        registeredPlayers: [],
        interestedPlayers: [],
        revenue: 0,
        address: user.address ? user.address : {},
        status: "active",
        eventImageUrl:
          imageUrl && imageUploadDetails
            ? imageUploadDetails.uploadedImageUrl
            : user.profileImageUrl,
      })

      const result = await newEvent.save()

      return res.status(200).json({
        success: true,
        eventId: result._id,
      })
    }
  } catch (err) {
    console.log(err)
    if (err instanceof Error.ValidationError) {
      const errorResponse = formatValidationErrors(err)
      return res.status(422).json(errorResponse)
    }
    next(err)
  }
}

export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const imageUrl = req.file ? req.file.path : ""

  try {
    const userId = getUserId(req)
    const arenaOwner = await ArenaModel.findById(req.body.creator)
    const event = await EventModel.findById(req.params.id)

    if (arenaOwner && event && userId === event.creator) {
      let imageUploadDetails: any = null
      if (imageUrl) imageUploadDetails = await uploadImage(imageUrl)

      const updatedEvent = await EventModel.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          entryFee: +req.body.entryFee,
          maxPlayers: +req.body.maxPlayers,
          minPlayers: +req.body.minPlayers,
          location: event.location ? event.location : {},
          registeredPlayers: event.registeredPlayers,
          interestedPlayers: event.interestedPlayers,
          revenue: event.revenue,
          address: event.address ? event.address : {},
          eventImageUrl:
            imageUrl && imageUploadDetails
              ? imageUploadDetails.uploadedImageUrl
              : event.eventImageUrl,
        },
        {
          new: true,
          runValidators: true,
        }
      ).exec()

      if (updatedEvent) {
        for (const player of updatedEvent.interestedPlayers) {
          const notifyForInterested = await createNotification(
            arenaOwner._id,
            player,
            "eventUpdated",
            `${arenaOwner.arenaName} has updated the event ${updatedEvent.title}`,
            "arenaToPlayer",
            updatedEvent._id,
            next
          )
        }

        for (const player of updatedEvent.registeredPlayers) {
          const notifyForInterested = await createNotification(
            arenaOwner._id,
            player,
            "eventUpdated",
            `${arenaOwner.arenaName} has updated the event ${updatedEvent.title}`,
            "arenaToPlayer",
            updatedEvent._id,
            next
          )
        }

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
    if (err instanceof Error.ValidationError) {
      const errorResponse = formatValidationErrors(err)
      return res.status(422).json(errorResponse)
    }
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

        for (const playerId of event.registeredPlayers) {
          const tempPlayer = await PlayerModel.findByIdAndUpdate(
            playerId,
            {
              $inc: {
                wallet: event.entryFee,
              },
            },
            {
              new: true,
              runValidators: true,
            }
          ).exec()
        }
        event.registeredPlayers = []
        event.interestedPlayers = []

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
    const userId = getUserId(req)
    const searchParams: any = req.body
    const pageSize = req.body.pageSize
    const pageNumber = req.body.pageNumber
    const skipItems = (pageNumber - 1) * pageSize

    // console.log("params", searchParams)
    let query: any = {}
    query.creator = userId

    if (searchParams.eventTitle)
      query.title = {
        $regex: String(searchParams.eventTitle),
        $options: "i",
      }
    if (searchParams.sportType) query.sportType = searchParams.sportType

    if (searchParams.eventStartTime && searchParams.eventEndTime)
      query.start = {
        $gte: searchParams.eventStartTime,
        $lte: searchParams.eventEndTime,
      }
    if (userId) {
      const events = await EventModel.find(query)
        .sort({ start: -1 })
        .skip(skipItems)
        .limit(pageSize)
      const totalArenaEvents = await EventModel.countDocuments(query)

      return res.status(200).json({
        success: true,
        eventList: events,
        totalArenaEvents,
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
  const pageSize = req.body.pageSize
  const pageNumber = req.body.pageNumber
  const skipItems = (pageNumber - 1) * pageSize
  console.log("params", searchParams)
  let query: any = {}
  if (searchParams.eventTitle)
    query.title = {
      $regex: String(searchParams.eventTitle),
      $options: "i",
    }
  if (searchParams.sportType) query.sportType = searchParams.sportType

  if (searchParams.eventStartTime && searchParams.eventEndTime)
    query.start = {
      $gte: searchParams.eventStartTime,
      $lte: searchParams.eventEndTime,
    }

  if (searchParams.eventFee)
    query.entryFee = {
      $gte: searchParams.eventFee[0],
      $lte: searchParams.eventFee[1],
    }
  let sort: any = {}

  if (searchParams.sortBy && searchParams.sortValue) {
    sort = {
      [searchParams.sortBy]: searchParams.sortValue,
    }
  }
  try {
    let events = await EventModel.find(query).sort(sort)
    if (searchParams.location) {
      events = events.filter(
        (item) =>
          item.location.lat <= searchParams.location.lat + 2 &&
          item.location.lat >= searchParams.location.lat - 2
      )

      events = events.filter(
        (item) =>
          item.location.lng <= searchParams.location.lng + 2 &&
          item.location.lng >= searchParams.location.lng - 2
      )
    }
    let totalEvents = events.length
    const start=0+pageSize*(pageNumber-1)
    let end=0
    if((start+pageSize)===(totalEvents-1)){
      end = totalEvents-1
    }
    else{
      end = start+pageSize
    }

    return res.status(200).json({
      success: true,
      eventList: events.slice(start,end),
      totalEvents
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

      const notify = await createNotification(
        player._id,
        event.creator,
        "interested",
        `${player.firstName} ${player.lastName} is interested in ${event.title}`,
        "playerToArena",
        event._id,
        next
      )
      if (notify) {
        const res1 = await player.save()
        const res2 = await event.save()

        if (res1 && res2) {
          return res.status(200).json({
            success: true,
            event: res2,
          })
        }
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

export const updateRegistered = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserId(req)
    const registered = req.body.registered
    const fee = req.body.fee
    const withWallet = req.body.withWallet
    const player = await PlayerModel.findById(userId)
    const event = await EventModel.findById(req.params.id)

    if (player && event) {
      if (registered) {
        player.registeredEvents.push(event._id)
        event.registeredPlayers.push(player._id)
        event.revenue += fee
        if (withWallet) {
          player.wallet -= fee
          player.wallet < 0 ? (player.wallet = 0) : player.wallet
        }
      } else {
        player.registeredEvents = player.registeredEvents.filter(
          (item) => item != event._id
        )
        event.registeredPlayers = event.registeredPlayers.filter(
          (item) => item != userId
        )
        player.wallet += +(fee * 0.99).toFixed(2)
        event.revenue -= fee
        event.revenue < 0 ? (event.revenue = 0) : event.revenue
      }

      const notify = await createNotification(
        player._id,
        event.creator,
        "registered",
        `${player.firstName} ${player.lastName} has registered for ${event.title}`,
        "playerToArena",
        event._id,
        next
      )

      if (notify) {
        const res1 = await player.save()
        const res2 = await event.save()

        if (res1 && res2) {
          return res.status(200).json({
            success: true,
            event: res2,
          })
        }
      } else {
        return res.status(422).json({
          success: false,
          error: "Could not update registration",
        })
      }
    } else {
      return res.status(422).json({
        success: false,
        error: "Could not update registration",
      })
    }
  } catch (err) {
    console.log(err)
    next(err)
  }
}

export const getMinMaxPrice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let maxFee: number
    let minFee: number
    const maxEvent = await EventModel.find({}).sort({ entryFee: -1 }).limit(1)

    const minEvent = await EventModel.find({}).sort({ entryFee: 1 }).limit(1)

    if (maxEvent && minEvent) {
      return res.status(200).json({
        success: true,
        maxEvent: maxEvent[0],
        minEvent: minEvent[0],
      })
    }
  } catch (err) {
    next(err)
  }
}

export const getMinMaxDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let maxDate: Date
    let minDate: Date
    const maxEvent = await EventModel.find({}).sort({ start: -1 }).limit(1)

    const minEvent = await EventModel.find({}).sort({ start: 1 }).limit(1)

    if (maxEvent && minEvent) {
      return res.status(200).json({
        success: true,
        maxEvent: maxEvent[0],
        minEvent: minEvent[0],
      })
    }
  } catch (err) {
    next(err)
  }
}

export const fetchAllEventsByCreator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const creatorId = req.body.creator
    const eventStartTime = req.body.eventStartTime
    let query: any = {}

    if (eventStartTime)
      query.start = {
        $gte: eventStartTime,
      }
    if (creatorId) query.creator = creatorId

    if (creatorId) {
      const events = await EventModel.find(query).sort({ start: 1 }).limit(4)
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

export const inviteFriends = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const friendsIds = req.body.friendsIds
  const userId = getUserId(req)
  const eventId = req.body.eventId
  const user = await PlayerModel.findById(userId)
  const event = await EventModel.findById(eventId)
  try {
    if (friendsIds.length > 0 && user && event) {
      for (const player of friendsIds) {
        const notifyForInterested = await createNotification(
          userId,
          player,
          "eventInvitation",
          `${user.firstName} has invited you to the event ${event.title}`,
          "playerToPlayer",
          event._id,
          next
        )
      }

      return res.status(200).json({
        success: true,
        message: "Players invited successfully",
      })
    } else {
      return res.status(422).json({
        success: false,
        error: "Could not the invite friends",
      })
    }
  } catch (err) {
    next(err)
  }
}

export const createPaymentIntent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const amount = req.body.amount
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2020-08-27",
  })
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "eur",
    })

    return res.status(200).json({
      success: true,
      secretKey: paymentIntent.client_secret,
    })
  } catch (err) {
    next(err)
  }
}

export const regConflict = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserId(req)
    const eventSearchId = req.params.eventId

    const event = await EventModel.findById(eventSearchId)
    const player = await PlayerModel.findById(userId)
    let eventConflict: boolean = false
    //console.log(event)

    if (player && event) {
      for (const eventId of player.registeredEvents) {
        const regEvent = await EventModel.findById(eventId)
        if (
          regEvent &&
          regEvent.start &&
          regEvent.end &&
          event.start &&
          event.end
        ) {
          if (
            regEvent.id !== event.id &&
            regEvent.start <= event.end &&
            regEvent.end >= event.start
          ) {
            eventConflict = true
            break
          }
        }
      }
      return res.status(200).json({
        success: true,
        eventConflict: eventConflict,
      })
    } else {
      return res.status(422).json({
        success: false,
        error: "Could not find the user and event",
      })
    }
  } catch (err) {
    console.log(err)
    next(err)
  }
}
