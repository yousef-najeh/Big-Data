const esClient = require("../config/elasticsearchConfig");

exports.searchTweets = async (query, size = 10000) => {
    return await esClient.search({
        index: "tweets",
        size,
        body: { query },
    });
};

exports.aggregateTweets = async (query, aggregations) => {
    return await esClient.search({
        index: "tweets",
        size: 0,
        body: {
            query,
            aggs: aggregations,
        },
    });
};

exports.getTweetsWithCoordinates = async (query, size = 10000) => {
    return await esClient.search({
        index: "tweets",
        size,
        body: {
            query,
            _source: ["coordinates"],
        },
    });
};

exports.getTweetById = async (id) => {
    return await esClient.get({
        index: "tweets",
        id,
    });
};
