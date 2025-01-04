const { Client } = require("@elastic/elasticsearch");
const dotenv = require("dotenv");

dotenv.config();

const esClient = new Client({
    node: process.env.ELASTICSEARCH_URL,
});

module.exports = esClient;
