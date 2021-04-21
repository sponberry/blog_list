const logger = require("./logger")

const requestLogger = (request, response, next) => {
  if (process.env.NODE_ENV !== "test") {
    logger.info("Method:", request.method)
    logger.info("Path:  ", request.path)
    logger.info("Body:  ", request.body)
    logger.info("---")
    next()
  }
}

module.exports = { requestLogger }
