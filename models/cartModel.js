import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.ObjectId,
    ref: "Product",
    // required: true,
  },
  quantity: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.ObjectId, ref: "user", required: true },
  items: [cartItemSchema],
});

export default mongoose.model("Cart", cartSchema);
