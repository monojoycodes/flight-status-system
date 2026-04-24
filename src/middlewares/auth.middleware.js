import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: NO TOKENS! (try try but don't cry!)"
      });
    }
    const decoded = jwt.verify(token, process.env.ACCESSTOKENSECRET);
    req.user = decoded; //attach the user
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};
