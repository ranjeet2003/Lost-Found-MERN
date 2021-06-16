const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const docRoutes = require("./routes/doc-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

// const newDocRoute = require("./routes/docRoute");

const app = express();
app.use(cors());
// app.use(express.bodyParser({ limit: "50mb" }));
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

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Contorl-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/docs", docRoutes);
app.use("/api/users", usersRoutes);
// app.use("/api/docs", newDocRoute);

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
