import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userrSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Name must Contain at Least 3 characters!"],
    maxLength: [30, "Name Cannot exceed 30 characters!"],
  },
  email: {
    type: String,
    required: [true, "Please Provide Your Email"],
    validate: [validator.isEmail, "Please provide a valid email!"],
  },
  phone: {
    type: Number,
    required: [true, "please provide Your Phone number . "],
  },
  password: {
    type: String,
    required: [true, "Please provide Your Password!"],
    minLength: [8, "Password must Contain at Least 8 characters!"],
    maxLength: [32, "Password Cannot exceed 32 characters!"],
    select: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//HASING THE PASSWORD

userrSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // the (bcrypt.hash) work is its not showing real password to public in monngoodb
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userrSchema.methods.comparePassword = async function (enteredpassword) {
  return await bcrypt.compare(enteredpassword, this.password);
};

//GENERATING A JWT TOKEN FOR AUTHORIZATION
// userrSchema.methods.getJWTToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
//     expiresIn: process.env.JWT_EXPIRE,
//   });
// };

export const User = mongoose.model("User", userrSchema);
