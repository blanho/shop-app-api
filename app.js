const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./db/connection");
const { BadRequest } = require("./errors");
const notFound = require("./middleware/404");
const errorHandling = require("./middleware/errors");

app.get("/", async (req, res) => {
  res.send("Hello world");
});

const PORT = process.env.PORT || 5000;

// Error handling
app.use(notFound);
app.use(errorHandling);

const startServer = async (req, res, next) => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is listening on ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
