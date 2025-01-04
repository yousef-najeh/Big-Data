const express = require("express");
const router = express.Router();
const elasticController = require("../controllers/elasticController");

router.get("/tweets", elasticController.fetchTweets);
router.get("/tweets/search", elasticController.searchTweets);
router.get("/tweets/chart", elasticController.fetchTweetCounts);
router.get("/tweets/map", elasticController.fetchTweetMap);
router.get("/tweets/trend", elasticController.fetchTopHashtags);
router.get("/tweets/:id", elasticController.fetchTweetById);

module.exports = router;
