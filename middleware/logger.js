// middleware/logger.js

/**
 * Basic request logger middleware
 */
function requestLogger(req, res, next) {
  const start = Date.now();
  const { method, url, ip } = req;

  // Log the request
  console.log(`[${new Date().toISOString()}] ${method} ${url} - IP: ${ip}`);

  // Log the response
  res.on("finish", () => {
    const duration = Date.now() - start;
    const { statusCode } = res;

    console.log(
      `[${new Date().toISOString()}] ${method} ${url} - Status: ${statusCode} - Duration: ${duration}ms`
    );
  });

  next();
}

module.exports = {
  requestLogger,
};
