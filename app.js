import globalErrorHandlerMiddleware from "./middlewares/globalErrorHandler.js";
import notFoundMiddleware from "./middlewares/notFoundHandler.js";
import authRouter from "./routers/authRoutes.js";

import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());

// SIGNING THE COOKIE
app.use(cookieParser(process.env.JWT_SECRET));

app.get("/", (req, res) => {
  // when i signed the cookie , the cookie will not available in req.cookie
  // instead will be available in req.signedCookies

  console.log(req.signedCookies);
  res.send("<h1>e-commerce</h1>");
});

app.use("/api/v1/auth", authRouter);

app.use(notFoundMiddleware);

app.use(globalErrorHandlerMiddleware);

export default app;
