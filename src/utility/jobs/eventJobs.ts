import EventModel from "../../models/event/EventModel"

export const updateEventsStatus = async () => {
  try {
    let events = await EventModel.updateMany(
      {
        status: "active",
        start: {
          $lt: new Date(),
        },
      },
      { status: "over" }
    )

    console.log("past events updated")
  } catch (err) {
    console.log(err)
  }
}
