export const groupTweetsByDate = (hits) => {
    const counts = {};
    hits.forEach((hit) => {
        const date = new Date(hit._source.created_at)
            .toISOString()
            .split("T")[0]; 
        counts[date] = (counts[date] || 0) + 1;
    });

    return counts;
};

export const prepareChartData = (counts) => {
    const labels = Object.keys(counts).sort(); 
    const data = labels.map((key) => counts[key]); 

    return {
        labels,
        datasets: [
            {
                label: "Tweet Count",
                data,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };
};
