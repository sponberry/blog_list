const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const config = require("./utils/config")
const logger = require("./utils/logger")
const app = express()
const blogRouter = require("./controllers/blogs")


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

app.use("/api/blogs", blogRouter)


module.exports = app