import { Request, Response, NextFunction } from "express"
import EventModel from "../../models/event/EventModel"

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventToCreate = req.body
    const doc = new EventModel(eventToCreate)
    const newEvent = await doc.save()

    return res.status(200).json({
      success: true,
      eventId: newEvent._id,
    })
  } catch (err) {
    console.log(err)
    next(err)
  }
}

export default { createEvent }
