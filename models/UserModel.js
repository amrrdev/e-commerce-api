import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
    minLength: [3, "A name must have at least 3 characters"],
    maxLength: [20, "A name must have no more than 20 characters."],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please tell your email!"],
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    minLength: [8, "The password must have more or equal then 8 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (passwordConfirm) {
        return passwordConfirm === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

// remove passwordConfirm
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

UserSchema.methods.comparePasswords = async function (
  candidatePassword,
  encryptedPassword
) {
  return await bcrypt.compare(candidatePassword, encryptedPassword);
};

const User = mongoose.model("Users", UserSchema);
export default User;
