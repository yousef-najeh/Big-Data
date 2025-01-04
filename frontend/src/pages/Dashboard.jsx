import { useQuery } from '@tanstack/react-query';
import * as chartHelper from '../helpers/chartHelper';
import Chart from '../components/Chart';
import Map from '../components/Map';
import NavBar from '../components/NavBar';

const Dashboard = () => {
  const { data: chartDataResponse, isLoading: isChartLoading } = useQuery({
    queryKey: ["chart"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/api/tweets/chart");
      return response.json();
    },
    refetchInterval: 30000,
  });

  const { data: mapDataResponse, isLoading: isMapLoading } = useQuery({
    queryKey: ["map"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/api/tweets/map");
      return response.json();
    },
    refetchInterval: 30000,
  });



  if (isChartLoading || isMapLoading) {
    return <div>Loading...</div>;
  }

  const chartData = chartHelper.prepareChartData(chartDataResponse);

  return (
    <div>
      <NavBar />
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
