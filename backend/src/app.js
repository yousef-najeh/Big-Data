const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const testRoute = require("./routes/testRoute");
app.use("/api/test", testRoute);

module.exports = app;
