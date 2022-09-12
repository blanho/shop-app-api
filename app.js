require("express-async-errors");
require("dotenv").config();

const express = require("express");
const app = express();
const connectDB = require("./db/connection");
const notFound = require("./middleware/404");
const errorHandling = require("./middleware/errors");

const authRouter = require("./routes/authRoutes");

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRouter);

// Port
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
