const express = require("express");
const router = express.Router();
const elasticController = require("../controllers/elasticController");

router.get("/tweets", elasticController.fetchTweets);
router.get("/tweets/search", elasticController.searchTweets);

module.exports = router;
