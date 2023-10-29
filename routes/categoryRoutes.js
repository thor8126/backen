import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import {
  categoryController,
  createCategoryController,
  deleteeCategorController,
  singleCategoryController,
  updateCategorController,
} from "../controllers/categoryControler.js";
const router = express.Router();

// routers
// create category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

// update category
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategorController
);

// get all category
router.get("/get-category", categoryController);

// single category
router.get("/single-category/:slug", singleCategoryController);

// delete category
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteeCategorController
);

export default router;
