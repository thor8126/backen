import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter ur name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter ur email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter ur password"],
    },
    phone: {
      type: String,
      required: [true, "Please enter ur phone"],
    },
    address: {
      type: String,
      required: [true, "Please enter ur address"],
    },
    answer: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("user", userSchema);
