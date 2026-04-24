import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "John Doe"
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  airline: {
    type: String,
    uppercase: true,
    trim: true,
    default: null
  },

  role: {
    type: String,
    enum: ["ARL", "AOT", "USR"],
    required: true,
    default: "USR"
  },

  code: {
    type: String,
    required: true,
    uppercase: true,
    match: /^[A-Z0-9]{5}$/ // fixed 5-char identifier
  },

  refreshToken: {
    type: String,
    default: null
  }
});

// hash the password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
      airline: this.airline
    },
    process.env.ACCESSTOKENSECRET,
    { expiresIn: process.env.ACCESSTOKENEXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
      code: this.code
    },
    process.env.REFRESHTOKENSECRET,
    { expiresIn: process.env.REFRESHTOKENEXPIRY }
  );
};

userSchema.methods.generateTokens = function () {
  return {
    accessToken: this.generateAccessToken(),
    refreshToken: this.generateRefreshToken()
  };
};

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
