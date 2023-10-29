import slugify from "slugify";
import productModel from "../models/productModel.js";
import categortModel from "../models/categortModel.js";
import fs from "fs";
import OrderModel from "../models/orderModel.js";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

// payment gateay
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// creating a new Product
export const createProductController = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      colors,
      category,
      shipping,
      brand,
      size,
      isAvailable,
    } = req.fields;

    const { photo } = req.files;
    let keys = [
      "name",
      "description",
      "price",
      "category",
      "photo",
      "shipping",
      "brand",
      "size",
      "colors",
      "isAvailable",
    ];

    [
      name,
      description,
      price,
      category,
      photo,
      shipping,
      brand,
      size,
      colors,
      isAvailable,
    ].forEach((key, i) => {
      if (!key) {
        return res.status(404).send({ message: `${keys[i]} is required` });
      }
    });
    if (photo.size > 1000000) {
      return res.status(404).send({ message: `photo size greater then 1 mb` });
    }
    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: `${name} `,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating Product",
      error,
    });
  }
};

// get all produts
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .select("-photo")
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "AllProducts",
      totalCount: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting all products",
      error,
    });
  }
};

// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .find({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "One Product",
      totalCount: product.length,
      product: product[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Getting One Product",
      error,
    });
  }
};

// get product photo
export const getProductPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Getting One Photo from Product",
      error,
    });
  }
};

// delete a product
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid);
    res.status(200).send({
      success: true,
      message: "Product Deleted SuccessFully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Deleting Product",
      error,
    });
  }
};

// update product conroler
export const updateProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      colors,
      shipping,
      brand,
      size,
      isAvailable,
    } = req.fields;
    const { photo } = req.files;
    let keys = [
      "name",
      "description",
      "price",
      "category",
      "shipping",
      "brand",
      "size",
      "colors",
      "isAvailable",
    ];

    for (const key of keys) {
      if (!req.fields[key]) {
        return res.status(400).send({ message: `${key} is required` });
      }
    }
    let products = await productModel.findById(req.params.pid);

    if (!products) {
      return res.status(404).send({ message: "Product not found" });
    }

    if (photo && photo.size > 1000000) {
      return res
        .status(400)
        .send({ message: `Photo size is greater than 1 MB` });
    }

    // Check if a new photo has been provided
    if (photo) {
      products.name = name;
      products.description = description;
      products.price = price;
      products.category = category;
      products.shipping = shipping;
      products.brand = brand;
      products.size = size;
      products.colors = colors;
      products.isAvailable = isAvailable === "true";

      products.slug = slugify(name);
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    } else {
      // If no new photo provided, keep the existing photo
      products.name = name;
      products.description = description;
      products.price = price;
      products.category = category;
      products.shipping = shipping;
      products.brand = brand;
      products.size = size;
      products.colors = colors;
      products.isAvailable = isAvailable === "true";
      products.slug = slugify(name);
    }

    await products.save();

    return res.status(201).send({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating Product",
      error: error.message,
    });
  }
};

// filter products
export const productFiltersController = async (req, res) => {
  try {
    const { brand, value, checked, colors, size } = req.body;

    const filter = {};
    // Check if any categories are selected
    if (checked && checked.length > 0) {
      filter.category = { $in: checked };
    }
    // Check if price range is specified
    if (value && value.length === 2) {
      filter.price = { $gte: value[0], $lte: value[1] };
    }

    // Check if brands are selected
    if (brand && brand.length > 0) {
      filter.brand = { $in: brand };
    }
    // Check if colors are specified
    if (colors && colors.length > 0) {
      // Combine the $or conditions using $or
      const colorArray = colors.split("-").map((color) => color.trim());

      // Create an array of $or conditions for each color
      const colorConditions = colorArray.map((color) => ({
        colors: { $regex: color, $options: "i" },
      }));

      // Combine the $or conditions using $or
      filter.$or = colorConditions;
    }

    if (size) {
      const sizeArray = size.split("-").map((s) => s.trim());
      const sizeRegex = sizeArray.map((s) => new RegExp(`\\b${s}\\b`, "i"));
      filter.size = { $in: sizeRegex };
    }

    // Query the database with the constructed filter
    const products = await productModel
      .find(filter)
      .select("-photo")
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      length: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while filtering Products",
      error: error.message,
    });
  }
};

// Product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting count Products",
      error: error.message,
    });
  }
};

// product per page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in per page ctrl",
      error: error.message,
    });
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
          { brand: { $regex: keyword, $options: "i" } },
          { colors: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo")
      .populate("category")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      results,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in search product",
      error: error.message,
    });
  }
};

// sililar products
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .limit(5)
      .select("-photo")
      .populate("category")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in similar product",
      error: error.message,
    });
  }
};

// category wise product
export const productCategoryController = async (req, res) => {
  try {
    const category = await categortModel.find({ slug: req.params.slug });
    const products = await productModel
      .find({ category })
      .populate("category")
      .select("-photo");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in category wise product",
      error: error.message,
    });
  }
};

// payment gateway api
export const brainTreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// // payments
export const brainTreePaymentsController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((item) => (total = total + item.price));
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new OrderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send({
            message: error.message,
            error: error,
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
