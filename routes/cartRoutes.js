import express from "express";
import { requireSignIn } from "../middleware/authMiddleware.js";
import { getCart, savecart } from "../controllers/cartController.js";
const router = express.Router();

router.get("/get-cart", requireSignIn, getCart);

router.post("/save-cart", requireSignIn, savecart);

export default router;
