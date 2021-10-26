const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const docRoutes = require("./routes/doc-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./util/http-error");
const cookieParser = require("cookie-parser");

require("dotenv").config({ path: "./config.env" });

const app = express();

app.use(cookieParser(process.env.JWT_SECRET));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Contorl-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/api/docs", docRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

const PASSWORD = process.env.MONGO_PASSWORD;

mongoose
  .connect(
    `mongodb+srv://ranjeet:${PASSWORD}@cluster0.kxva0.mongodb.net/LFDetails?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      console.log(err);
    }
  )
  .then(() => {
    app.listen(5555);
    console.log("Connection Successfull");
  })
  .catch((err) => {
    console.log("Catch error");
    console.log(err);
  });
