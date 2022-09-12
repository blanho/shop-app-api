const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hi");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is listening to ${PORT}`);
});
