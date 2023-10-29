import categortModel from "../models/categortModel.js";
import slugify from "slugify";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({
        message: "Name is required",
      });
    }
    const existingCategory = await categortModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: false,
        message: `${name} already Exist`,
      });
    }

    const category = await new categortModel({
      name,
      slug: slugify(name),
    }).save();
    return res.status(201).send({
      success: true,
      message: "new category created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in category",
      error,
    });
  }
};

// updarte category
export const updateCategorController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categortModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: `${name} updated sucessfully`,
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating category",
      error,
    });
  }
};

// get all categories
export const categoryController = async (req, res) => {
  try {
    const category = await categortModel.find({});
    res.status(200).send({
      success: true,
      message: "All Categories List",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting all categories",
      error,
    });
  }
};

// get single category
export const singleCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await categortModel.findOne({ slug });
    res.status(200).send({
      success: true,
      message: "Get Sinlge category Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting one category",
      error,
    });
  }
};

// delete category

export const deleteeCategorController = async (req, res) => {
  try {
    const { id } = req.params;
    await categortModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: " deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting one category",
      error,
    });
  }
};
