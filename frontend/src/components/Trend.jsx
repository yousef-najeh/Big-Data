
const Trend = ({ trendTag }) => {    
    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Top Trend</h1>
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "20px",
                    textAlign: "left",
                }}
            >
                <thead>
                    <tr>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Hashtag</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Count</th>
                    </tr>
                </thead>
                <tbody>
                    {trendTag.topHashtags.map((hashtag, index) => (
                        <tr key={index}>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                #{hashtag.key}
                            </td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                {hashtag.doc_count.toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Trend