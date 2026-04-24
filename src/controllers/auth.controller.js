import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const { accessToken, refreshToken } = user.generateTokens();

    // 🔒 hash refresh token before storing
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    user.refreshToken = hashedRefreshToken;

    await user.save();
    // 🍪 Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Login successful"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Login error",
      error: error.message
    });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.refreshToken = null;
    await user.save();

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      message: `${user.name} has been logged out. See you soon!`,
      code: user.code
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to logout user", error: error });
  }
};

const generateUniqueCode = async () => {
  let code;
  let exists = true;
  const alphanumericChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  while (exists) {
    code = "";
    for (let i = 0; i < 5; i++) {
      code += alphanumericChars.charAt(Math.floor(Math.random() * alphanumericChars.length));
    }
    const user = await User.findOne({ code });
    if (!user) exists = false;
  }

  return code;
};

export const register = async (req, res) => {
  try {
    const { name, email, password, airline, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({
          message: `${name} with ${email} already exists with ${airline} airline.`,
          registeredCode: existingUser.code
        });
    }

    const code = await generateUniqueCode();

    //create user
    let assignedRole = "USR";

    // ONLY allow role override if requester is AOT (future)
    if (req.user && req.user.role === "AOT") {
      assignedRole = role || "USR";
    }

    const user = await User.create({
      name,
      email,
      password,
      airline,
      role: assignedRole,
      code
    });

    return res.status(200).json({
      message: `${name} has been succesfully registered!`,
      detail: {
        airline: airline,
        code: code
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "ERROR",
      error: error.message
    });
  }
};

export const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role, airline } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // 🔥 role validation
    if (!["ARL", "AOT"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role"
      });
    }

    const code = await generateUniqueCode();

    const user = await User.create({
      name,
      email,
      password,
      role,
      airline: role === "ARL" ? airline : null,
      code
    });

    return res.status(201).json({
      message: "User created by admin",
      user: {
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Admin user creation failed",
      error: error.message
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({
        message: "No refresh token"
      });
    }

    const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESHTOKENSECRET);

    const user = await User.findById(decoded.id);

    if (!user || !user.refreshToken) {
      return res.status(403).json({
        message: "Invalid refresh token!"
      });
    }

    const isMatch = await bcrypt.compare(incomingRefreshToken, user.refreshToken);

    if (!isMatch) {
      return res.status(403).json({
        message: "Refresh token mismatch"
      });
    }

    // 🔥 generate new access token
    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        airline: user.airline
      },
      process.env.ACCESSTOKENSECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false
    });

    return res.status(200).json({
      message: "Access token refreshed"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while refreshing access token",
      error: error
    });
  }
};
