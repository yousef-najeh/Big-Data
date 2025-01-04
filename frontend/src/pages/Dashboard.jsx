import { useQuery } from '@tanstack/react-query';
import * as chartHelper from '../helpers/chartHelper';
import Chart from '../components/Chart';
import Map from '../components/Map';
import Navbar from '../components/NavBar'; // Import Navbar

const Dashboard = () => {
  const { data, isLoading: isTweetsLoading } = useQuery({
    queryKey: ["tweets"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/api/tweets");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isTweetsLoading) {
    return <div>Loading...</div>;
  }

  const tweetCounts = chartHelper.groupTweetsByDate(data.hits.hits);
  const chartData = chartHelper.prepareChartData(tweetCounts);

  return (
    <div>
      <Navbar /> {/* Use Navbar component */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginTop: '8%' }}>
        <div style={{ flex: 1 }}>
          <Chart chartData={chartData} />
        </div>
        <div style={{ flex: 1 }}>
          <Map tweets={data.hits.hits} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
