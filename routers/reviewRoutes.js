import * as reviewController from "./../controllers/reviewController.js";
import * as authentication from "./../middlewares/authentication.js";
import express from "express";

const router = express.Router();

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(authentication.isAuthenticated, reviewController.createReview);
router
  .route("/:id")
  .get(reviewController.getSingleReview)
  .patch(authentication.isAuthenticated, reviewController.updateReview)
  .delete(authentication.isAuthenticated, reviewController.deleteReview);

export default router;
