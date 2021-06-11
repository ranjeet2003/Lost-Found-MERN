const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const docRoutes = require("./routes/doc-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Contorl-Allow-Methods", "GET, PSOT, PATCH, DELETE");
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

mongoose
  .connect(
    "mongodb+srv://ranjeet:ranjeet7537@cluster0.kxva0.mongodb.net/LFDetails?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      console.log("Connection Succesfull");
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5555);
  })
  .catch((err) => {
    console.log(err);
  });
