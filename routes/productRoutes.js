import express from "express";
const router = express.Router();
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import {
  brainTreePaymentsController,
  brainTreeTokenController,
  createProductController,
  deleteProductController,
  getProductController,
  getProductPhotoController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  relatedProductController,
  searchProductController,
  updateProductController,
} from "../controllers/productControler.js";
import formidable from "express-formidable";

// routes

// creating a product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable({ multiples: true }),
  createProductController
);

// get all products
router.get("/get-products", getProductController);

// get single product
router.get("/get-product/:slug", getSingleProductController);

// get product photo
router.get("/product-photo/:pid", getProductPhotoController);

// delete product
router.delete("/delete-product/:pid", deleteProductController);

// update product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

// filter product
router.post("/product-filters", productFiltersController);

// count products
router.get("/product-count", productCountController);

// product per Page
router.get("/product-list/:page", productListController);

// search product
router.get("/search/:keyword", searchProductController);

//similar products
router.get("/related-product/:pid/:cid", relatedProductController);

// category wise products
router.get("/product-category/:slug", productCategoryController);

//payments route
// token
router.get("/braintree/token", brainTreeTokenController);

// payments
router.post("/braintree/payments", requireSignIn, brainTreePaymentsController);

export default router;
