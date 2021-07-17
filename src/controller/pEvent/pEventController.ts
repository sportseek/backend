import { Request, Response, NextFunction } from "express"
import PEventModel from "../../models/event/PersonalEventModel"
import { getUserId } from "../../utility/helperFucntions/helperFunctions"
import { Error } from "mongoose"
import formatValidationErrors from "../../utility/formValidator"

export const createPEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserId(req)
    const newEvent = new PEventModel({ ...req.body, creator: userId })
    const event = await newEvent.save()

    return res.status(200).json({
      success: true,
      eventId: event._id,
    })
  } catch (err) {
    if (err instanceof Error.ValidationError) {
      const errorResponse = formatValidationErrors(err)
      return res.status(422).json(errorResponse)
    }
    next(err)
  }
}

export const fetchPEventList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserId(req)
    const events = await PEventModel.find({ creator: userId })
    return res.status(200).json({
      success: true,
      events: events,
    })
  } catch (err) {
    console.log(err)
    next(err)
  }
}

export const deletePEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // find and remove movie
    await PEventModel.findByIdAndRemove(req.params.id).exec()

    return res
      .status(200)
      .json({ message: `Personal Event successfully deleted` })
  } catch (err) {
    console.log(err)
    next(err)
  }
}

export const fetchAllPEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const searchParams: any = req.body
  console.log("params", searchParams)

  try {
    const query: any = {}

    if (searchParams.eventStartTime && searchParams.eventEndTime) {
      query.start = {
        $lte: searchParams.eventEndTime,
      }
      query.end = {
        $gte: searchParams.eventStartTime,
      }
    }

    console.log(query)
    const pEvents = await PEventModel.find(query)
    if (pEvents) {
      return res.status(200).json({
        success: true,
        eventList: pEvents,
      })
    } else {
      return res.status(422).json({
        success: false,
        error: "No schedules found",
      })
    }
  } catch (err) {
    next(err)
  }
}
