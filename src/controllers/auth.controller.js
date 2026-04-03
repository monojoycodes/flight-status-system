import { User } from "../models/users.js";

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
        const {name, email, password, airline, role } = req.body;

        const existingUser = await User.findOne({email});

        if (existingUser) {
            return res.status(400).json({message: `${name} with ${email} already exists with ${airline} airline.` , registeredCode: existingUser.code})
        }

        const code = await generateUniqueCode();

        //create user
        const user = await User.create({
            name,
            email,
            password,
            airline,
            role: role || "USR", //default value for safety
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