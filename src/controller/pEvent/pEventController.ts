import { Request, Response, NextFunction } from "express"
import PEventModel from "../../models/event/PersonalEventModel"
import { getUserId } from "../../utility/helperFucntions/helperFunctions"

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newEvent = new PEventModel(req.body)

    const event = await newEvent.save()

    return res.status(200).json({
      success: true,
      eventId: event._id,
    })
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
