import {
  Chart as ChartJS,
  CategoryScale, // Required for "category" scale
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Map from './components/Map'; // Ensure the component name matches the import

// Register components with Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = [
  {
    "text": "Exploring the beauty of nature! #Travel #Nature #Adventure",
    "hashtags": ["#Travel", "#Nature", "#Adventure"],
    "created_at": "2024-12-29T12:34:56Z",
    "sentiment_analysis": {
      "polarity": "positive",
      "score": 0.85
    },
    "location": "Yosemite National Park, CA"
  },
  {
    "text": "Monday blues hitting hard. Need coffee! #MondayMotivation #CoffeeLover",
    "hashtags": ["#MondayMotivation", "#CoffeeLover"],
    "created_at": "2024-12-29T09:15:30Z",
    "sentiment_analysis": {
      "polarity": "negative",
      "score": -0.4
    },
    "location": "Seattle, WA"
  },
  {
    "text": "Just finished my first marathon! Feeling accomplished. #Fitness #Running",
    "hashtags": ["#Fitness", "#Running"],
    "created_at": "2024-12-28T18:20:00Z",
    "sentiment_analysis": {
      "polarity": "positive",
      "score": 0.9
    },
    "location": "Boston, MA"
  }
];
const tweets = [
  { lat: 37.7749, lon: -122.4194, text: 'Tweet from San Francisco', sentiment: 'Positive' },
  { lat: 40.7128, lon: -74.0060, text: 'Tweet from New York', sentiment: 'Neutral' },
];
function App() {
  const tweetCounts = groupTweetsByDate(data); // Group tweets by date
  const chartData = prepareChartData(tweetCounts); // Prepare chart data

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Tweets Over Time',
      },
    },
    scales: {
      x: {
        type: 'category', // Categorical scale for the X-axis
      },
      y: {
        type: 'linear', // Linear scale for the Y-axis
      },
    },
  };
  

  return (
    <div>
      <h1>Tweets Over Time</h1>
      <Map tweets={tweets} />;
      <Bar data={chartData} options={options} />
    </div>
    
  );
}

// Group tweets by date
const groupTweetsByDate = (tweets) => {
  const counts = {};

  tweets.forEach((tweet) => {
    const date = new Date(tweet.created_at).toISOString().split('T')[0]; // Extract the date part
    counts[date] = (counts[date] || 0) + 1;
  });

  return counts;
};

// Prepare chart data
const prepareChartData = (counts) => {
  const labels = Object.keys(counts).sort(); // Sorted dates
  const data = labels.map((key) => counts[key]); // Corresponding tweet counts

  return {
    labels,
    datasets: [
      {
        label: 'Tweet Count',
        data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
};

export default App;
