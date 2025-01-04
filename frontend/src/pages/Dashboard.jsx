import { useQuery } from '@tanstack/react-query';
import * as chartHelper from '../helpers/chartHelper';
import Chart from '../components/Chart';
import Map from '../components/Map';

const Dashboard = () => {
  // Fetching chart data
  const { data: chartDataResponse, isLoading: isChartLoading } = useQuery({
    queryKey: ["chart"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/api/tweets/chart");
      return response.json();
    },
    refetchInterval: 30000,
  });

  // Fetching map data
  const { data: mapDataResponse, isLoading: isMapLoading } = useQuery({
    queryKey: ["map"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/api/tweets/map");
      return response.json();
    },
    refetchInterval: 30000,
  });

  // Show loading indicator if any data is still being loaded
  if (isChartLoading || isMapLoading) {
    return <div>Loading...</div>;
  }

  // Prepare chart data using the helper function
  const chartData = chartHelper.prepareChartData(chartDataResponse);

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Displaying chart and map side by side */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginTop: '8%' }}>
        <div style={{ flex: 1 }}>
          <Chart chartData={chartData} />
        </div>
        <div style={{ flex: 1 }}>
          <Map tweets={mapDataResponse.hits.hits} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
