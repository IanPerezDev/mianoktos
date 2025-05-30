function errorHandler(err, req, res, next) {
  console.error("Unhandled error:", err);

  res.status(500).json({
    success: false,
    message: "Ocurrió un error inesperado",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
}

module.exports = errorHandler;
