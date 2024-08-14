import * as orderController from "./../controllers/orderController.js";
import * as authentication from "./../middlewares/authentication.js";

import express from "express";

const router = express.Router();

router.use(authentication.isAuthenticated);

router
  .route("/")
  .post(orderController.createOrder)
  .get(
    authentication.authorizePermission("admin"),
    orderController.getAllOrders
  );

router.route("/myorders").get(orderController.getCurrentUserOrders);

router
  .route("/:id")
  .get(
    authentication.authorizePermission("admin"),
    orderController.getSingleOrder
  )
  .patch(orderController.updateOrder);

export default router;
