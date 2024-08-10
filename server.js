import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import app from "./app.js";
import mongoose from "mongoose";

const DB = process.env.DATABASE_STRING.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log(`DB Connected Successfully`))
  .catch((err) =>
    console.log(`Error while connecting with DB -> ${err.message}`)
  );

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
