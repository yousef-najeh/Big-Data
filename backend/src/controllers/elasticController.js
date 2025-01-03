const esClient = require("../config/elasticsearchConfig");

exports.searchTweets = async (req, res) => {
    const { keyword, startTime, endTime, location } = req.query;

    const query = { bool: { must: [], filter: [] } };

    if (keyword) {
        query.bool.must.push({
            match: { text: keyword },
        });
    }

    if (startTime || endTime) {
        query.bool.filter.push({
            range: {
                created_at: {
                    gte: startTime,
                    lte: endTime,
                },
            },
        });
    }

    if (location) {
        try {
            const { lat, lon } = JSON.parse(location);
            if (lat && lon) {
                query.bool.filter.push({
                    geo_distance: {
                        distance: "10km",
                        coordinates: { lat, lon },
                    },
                });
            } else {
                return res.status(400).send({
                    error: "Invalid location format. Expected {lat, lon}.",
                });
            }
        } catch (err) {
            return res
                .status(400)
                .send({ error: "Invalid location format. JSON parse failed." });
        }
    }

    try {
        const result = await esClient.search({
            index: "tweets",
            size: 10000,
            body: { query },
        });

        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
};

exports.fetchTweets = async (req, res) => {
    try {
        const result = await esClient.search({
            index: "tweets",
            size: 10000,
            query: {
                match_all: {},
            },
        });

        return res.status(200).send(result);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error.message });
    }
};
