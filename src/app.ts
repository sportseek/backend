import express, { Application, Request, Response, NextFunction } from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth"
import userRoutes from "./routes/user"
import eventRoutes from "./routes/event"
import pEventRoutes from "./routes/pEvent"
import arenaRoutes from "./routes/arena"
import notificationRoutes from "./routes/notification"

import mongoose from "mongoose"
import { HttpException } from "./exceptions/httpException"
import multer from "multer"
import path from "path"
import cors from "cors"

import { makeDir } from "./utility/helperFucntions/helperFunctions"

import * as schedule from "node-schedule"
import { updateEventsStatus } from "./utility/jobs/eventJobs"

dotenv.config()

const app: Application = express().use(cors())

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

app.use(express.json())

makeDir("images")

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
)
app.use("images", express.static(path.join(__dirname, "images")))

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  )
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Content-Type, Authorization, Origin, X-Requested-With"
  )
  next()
})

app.use("/auth", authRoutes)

app.use("/user", userRoutes)

app.use("/event", eventRoutes)

app.use("/personalevent", pEventRoutes)

app.use("/notification", notificationRoutes)

app.use("/arena", arenaRoutes)

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running")
})

app.use(
  (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    console.log(error)
    const status = error.status || 500
    const message = error.message
    res.status(status).json({
      success: false,
      errors: [message],
    })
  }
)

mongoose
  .connect(process.env.MONGODB_URI as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("server running")
    app.listen(process.env.PORT || 5000)

    const rule = new schedule.RecurrenceRule()
    rule.minute = 59
    const eventUpdateJob = schedule.scheduleJob(rule, function () {
      updateEventsStatus()
    })
  })
  .catch((err) => console.log(err))
