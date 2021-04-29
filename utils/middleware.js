const logger = require("./logger")
const jwt = require("jsonwebtoken")
const User = require("../models/user")

const requestLogger = (request, response, next) => {
  if (process.env.NODE_ENV !== "test") {
    logger.info("Method:", request.method)
    logger.info("Path:  ", request.path)
    logger.info("Body:  ", request.body)
    logger.info("---")
    next()
  }
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "404: blog id not found" })
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization")
  request.token = authorization && authorization.toLowerCase().startsWith("bearer ")
    ? authorization.substring(7)
    : null

  next()
}

const userExtractor = (async (request, response, next) => {
  if (!request.token) {
    request.user = null
    next()
  } else {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    request.user = await User.findById(decodedToken.id)
    next()
  }
})

module.exports = {
  requestLogger,
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
  userExtractor
}
