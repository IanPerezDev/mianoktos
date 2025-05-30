const contexto = (fnName, handler) => async (req, res, next) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.error(`[${fnName}]`, error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      function: fnName,
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

module.exports = { contexto };
