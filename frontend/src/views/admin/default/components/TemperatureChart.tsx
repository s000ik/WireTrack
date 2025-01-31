import React, { useEffect, useState } from 'react';
import { Box, Text, Spinner, Flex } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import Papa from 'papaparse';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Define the structure of the parsed CSV data
interface TemperatureData {
  Timestamp: string;
  'Tundish Temperature': string;
  'Bar Temperature': string;
  'Bath A Temperature': string;
  'Bath B Temperature': string;
}

const Histogram: React.FC = () => {
  const [data, setData] = useState<{
    timestamps: string[];
    tundishTemp: number[];
    barTemp: number[];
    bathATemp: number[];
    bathBTemp: number[];
  } | null>(null);

  useEffect(() => {
    // Fetch and parse the CSV file
    const fetchData = async () => {
      const response = await fetch('/data/temperature_remain.csv');
      const csvText = await response.text();

      // Parse the CSV text with PapaParse
      Papa.parse<TemperatureData>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const parsedData = {
            timestamps: result.data.map((d) => d.Timestamp),
            tundishTemp: result.data.map((d) => parseFloat(d['Tundish Temperature'] || '0')),
            barTemp: result.data.map((d) => parseFloat(d['Bar Temperature'] || '0')),
            bathATemp: result.data.map((d) => parseFloat(d['Bath A Temperature'] || '0')),
            bathBTemp: result.data.map((d) => parseFloat(d['Bath B Temperature'] || '0')),
          };
          setData(parsedData);
        },
      });
    };

    fetchData();
  }, []);

  if (!data) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  // Chart data configuration
  const chartData = {
    labels: data.timestamps,
    datasets: [
      {
        label: 'Tundish Temperature',
        data: data.tundishTemp,
        backgroundColor: 'rgba(128, 0, 128, 0.8)', // Purple
      },
      {
        label: 'Bar Temperature',
        data: data.barTemp,
        backgroundColor: 'rgba(192, 64, 192, 0.8)', // Light Purple
      },
      {
        label: 'Bath A Temperature',
        data: data.bathATemp,
        backgroundColor: 'rgba(224, 128, 224, 0.8)', // Lighter Purple
      },
      {
        label: 'Bath B Temperature',
        data: data.bathBTemp,
        backgroundColor: 'rgba(240, 192, 240, 0.8)', // Whitish Purple
      },
    ],
  };

  // Chart options configuration
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Timestamp',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Temperature (°C)',
        },
      },
    },
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4} textAlign="center">
        Temperature Histogram
      </Text>
      <Bar data={chartData} options={options} />
    </Box>
  );
};

export default Histogram;
