const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./db/connection");

app.get("/", (req, res) => {
  res.send("Hi");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
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
