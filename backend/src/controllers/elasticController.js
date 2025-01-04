const {
    searchTweets,
    aggregateTweets,
    getTweetsWithCoordinates,
    getTweetById,
} = require("../services/elasticServices");
const {
    buildQuery,
    buildAggregation,
    buildExactMatchQuery,
} = require("../helpers/elasticHelper");
const { aggregationType } = require("../config/aggregationType");

exports.searchTweets = async (req, res) => {
    try {
        const query = buildQuery(req.query);
        const aggregations = buildAggregation(
            aggregationType.TWEET_COUNTS,
            req.query.interval
        );
        const resultChart = await aggregateTweets(query, aggregations);

        const mapQuery = buildExactMatchQuery("coordinates", query);
        const resultMap = await getTweetsWithCoordinates(mapQuery);
        res.status(200).send({
            chart: { counts: resultChart.aggregations.tweets_per_day.buckets },
            map: resultMap,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
};

exports.fetchTweets = async (req, res) => {
    try {
        const result = await searchTweets({ match_all: {} });

        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error.message });
    }
};

exports.fetchTweetCounts = async (req, res) => {
    try {
        const query = buildQuery(req.query);
        const aggregations = buildAggregation(
            aggregationType.TWEET_COUNTS,
            req.query.interval
        );
        const result = await aggregateTweets(query, aggregations);

        res.status(200).send({
            counts: result.aggregations.tweets_per_day.buckets,
        });
    } catch (error) {
        console.error("Error fetching tweet counts:", error);
        res.status(500).send({ error: error.message });
    }
};

exports.fetchTopHashtags = async (req, res) => {
    try {
        const query = buildQuery(req.query);
        const aggregations = buildAggregation(aggregationType.TOP_HASHTAGS);
        const result = await aggregateTweets(query, aggregations);

        res.status(200).send({
            topHashtags: result.aggregations.top_hashtags.buckets,
        });
    } catch (error) {
        console.error("Error fetching top hashtags:", error);
        res.status(500).send({ error: error.message });
    }
};

exports.fetchTweetMap = async (req, res) => {
    try {
        const query = buildExactMatchQuery("coordinates", { match_all: {} });
        const result = await getTweetsWithCoordinates(query);

        res.status(200).send(result);
    } catch (error) {
        console.error("Error fetching tweet map:", error);
        res.status(500).send({ error: error.message });
    }
};

exports.fetchTweetById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send({ error: "Tweet id is required." });
    }
    try {
        const result = await getTweetById(id);

        res.status(200).send(result);
    } catch (error) {
        console.error("Error Tweet by id:", error);
        res.status(500).send({ error: error.message });
    }
};
