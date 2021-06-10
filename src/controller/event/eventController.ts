import { Request, Response, NextFunction } from "express"
import EventModel from "../../models/event/EventModel"

export const findById = async (req: Request, res: Response, next: NextFunction) => {
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