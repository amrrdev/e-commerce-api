import * as userController from "./../controllers/userController.js";
import {
  authorizePermission,
  isAuthenticated,
} from "../middlewares/authentication.js";

import express from "express";

const router = express.Router();

// /api/v1/users
router.use(isAuthenticated);

router
  .route("/")
  .get(authorizePermission("admin"), userController.getAllUsers)
  .post(userController.createUser);

router.route("/showMe").get(userController.showCurrectUser);
router.route("/updateUser").patch(userController.updateUser);
router.route("/updateUserPassword").patch(userController.updateUserPassword);

router
  .route("/:id")
  .get(authorizePermission("admin"), userController.getUserById);
export default router;
