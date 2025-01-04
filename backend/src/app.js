const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const elasticRoute = require("./routes/elasticRoute");

app.use("/api", elasticRoute);

module.exports = app;
