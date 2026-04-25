export const validate = (schema) => (req, res, next) => {
  try {
    // 🔥 Check req.query for GET requests, req.body for POST/PUT/DELETE
    const dataToValidate = req.method === "GET" ? req.query : req.body;
    schema.parse(dataToValidate);
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Validation error",
      errors: error.errors
    });
  }
};
