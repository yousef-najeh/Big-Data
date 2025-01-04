
function prepareChartDataResponse(responseData) {
    return responseData.counts.map((item) => ({
        labels: item.key_as_string,
        count: item.doc_count,
    }));
}

export const prepareChartData = (data) => {
    const chartData = prepareChartDataResponse(data);

    const labels = chartData.map((item) => {
        return new Date(item.labels).toISOString().split("T")[0];
    });
    const dataCounts = chartData.map((item) => {
        return item.count;
    });
    return {
        labels: labels,
        datasets: [
            {
                label: "Tweet Count",
                data: dataCounts,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };
};