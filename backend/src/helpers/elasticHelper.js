const { aggregationType } = require("../config/aggregationType");

exports.buildQuery = ({ keyword, startTime, endTime, location }) => {
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
                throw new Error(
                    "Invalid location format. Expected {lat, lon}."
                );
            }
        } catch (err) {
            throw new Error("Invalid location format. JSON parse failed.");
        }
    }
    return query;
};

exports.buildExactMatchQuery = (field, query) => {
    return {
        bool: {
            must: [query], 
            filter: [
                {
                    exists: {
                        field,
                    },
                },
            ],
        },
    };
}

exports.buildAggregation = (type, interval) => {
    switch (type) {
        case aggregationType.TWEET_COUNTS:
            return {
                tweets_per_day: {
                    date_histogram: {
                        field: "created_at",
                        calendar_interval: interval,
                    },
                },
            };
        case aggregationType.TOP_HASHTAGS:
            return {
                top_hashtags: {
                    terms: {
                        field: "hashtags",
                        size: 5,
                    },
                },
            };
        default:
            throw new Error("Unknown aggregation type.");
    }
};
