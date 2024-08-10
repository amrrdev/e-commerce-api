import * as authController from "../controllers/authController.js";

import app from "express";

const router = app.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/users", authController.getUsers);

export default router;
