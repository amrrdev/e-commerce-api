import * as productController from "./../controllers/productController.js";
import * as authentication from "./../middlewares/authentication.js";
import { getSingleProductReviews } from "../controllers/reviewController.js";

import express from "express";

const router = express.Router();

// Public routes
router.route("/").get(productController.getAllProducts);
router.route("/:id").get(productController.getSingleProduct);

// /products/9390324/reviews
router.route("/:id/reviews").get(getSingleProductReviews);

// Routes that require authentication
router.use(authentication.isAuthenticated);

// Routes that require admin authorization
router.use(authentication.authorizePermission("admin"));

router.route("/").post(productController.createProduct);

// upload images
router.post("/uploadImage", productController.uploadImage);

// NOTE: This route is currently unstable and may require further testing and improvements.
router.post(
  "/:id/uploadImage",
  productController.uploadImage,
  productController.updateProduct
);

router
  .route("/:id")
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

export default router;
