import { Request, Response, NextFunction } from "express"
import PEventModel from "../../models/event/PersonalEventModel"
import { getUserId } from "../../utility/helperFucntions/helperFunctions"

export const createPEvent = async (
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
    console.log(err.errors)
    return res.status(422).json(err.errors)
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
