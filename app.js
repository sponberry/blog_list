const express = require("express")
require("express-async-errors")
const cors = require("cors")
const mongoose = require("mongoose")
const config = require("./utils/config")
const logger = require("./utils/logger")
const middleware = require("./utils/middleware")
const app = express()
const blogRouter = require("./controllers/blogs")
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")

logger.info("connecting...")

const mdbParams = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }
mongoose.connect(config.MONGODB_URI, mdbParams)
  .then(() => {
    logger.info("connected to MongoDB")
  })
  .catch(error => {
    logger.error("error connecting:", error.message)
  })

app.use(cors())
app.use(express.json())

// app.use(middleware.requestLogger)

app.use("/api/users", usersRouter)
app.use("/api/blogs", blogRouter)
app.use("/api/login", loginRouter)
app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)


module.exports = app