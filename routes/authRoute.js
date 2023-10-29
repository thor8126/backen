import express from "express";
import {
  forgotPasswordControler,
  getAllOrdersController,
  getOrdersController,
  loginControler,
  orderStatusController,
  registerControler,
  testController,
  updateProfileController,
} from "../controllers/authControler.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
// router object
const router = express.Router();

// routing

// Register
router.post("/register", registerControler);

// Login
router.post("/login", loginControler);

// test routes
router.get("/test", requireSignIn, isAdmin, testController);

// Potected user auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
//  Potected admin auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// update profile
//  Potected admin auth
router.put("/profile", requireSignIn, updateProfileController);

// forgot password
router.post("/forgot-password", forgotPasswordControler);

// orders
router.get("/orders", requireSignIn, getOrdersController);

// all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// updating the order status
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);
export default router;
