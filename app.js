import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

// i am exporting app so that i can start server in server.js
export const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(bodyParser.json());

// rest api
// app.use("*", function (req, res, next) {
//   res.send("Welcome in Shoe world");
// });

app.get("/shoes", (req, res) => {
  res.send("welcome to shoe world");
});

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/cart", cartRoutes);
