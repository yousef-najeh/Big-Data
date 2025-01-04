/* eslint-disable react/prop-types */
import {
    Chart as ChartJS,
    CategoryScale, 
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const Chart = ({ chartData }) => {
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
                type: 'category', 
            },
            y: {
                type: 'linear', 
            },
        },
    };


    return (
        <div style={{ width: '50%', margin: 'auto' }}>
            <h1>Tweets Over Time</h1>
            <Bar data={chartData} options={options} />
        </div>
    );
}

export default Chart