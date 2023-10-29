import cartModel from "../models/cartModel.js";

// fetching the cart items
export const getCart = async (req, res) => {
  const user = req.user._id;
  try {
    const cart = await cartModel.findOne({ user: user }).populate("items");
    if (!cart) {
      return res.status(404).send({
        success: false,
      });
    }
    res.status(200).send({
      success: true,
      item: cart.items,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting cart from database",
      error,
    });
  }
};

// before logout we are saving tha data in cart or updating the cart
export const savecart = async (req, res) => {

  const user = req.user._id;
  const { cart } = req.body;
  try {
    const existingCart = await cartModel.findOne({ user });
    if (cart.length > 0) {
      if (existingCart) {
        // Update the existing cart
        existingCart.items = [...cart];
        await existingCart.save();
      } else {
        // Create a new cart
        await cartModel.create({ user, items: [...cart] });
      }
    } else {
      existingCart.items = [];
      await existingCart.save();
    }
    res.status(200).send({ message: "Cart data saved successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in saving the cart while logout",
      error,
    });
  }
};
