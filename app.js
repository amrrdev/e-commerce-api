import express from "express";
import fileUpload from "express-fileupload";
const app = express();

app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

export default app;
