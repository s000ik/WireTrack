'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Papa from 'papaparse';
import { Box, Heading } from '@chakra-ui/react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const LineAreaChart = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchCSVData = async () => {
      const response = await fetch('/data/quench_data.csv');
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const data = result.data;

          if (data.length === 0) {
            console.error('CSV data is empty or invalid.');
            return;
          }

          const times = data.map((item: any) => {
            const time = new Date(item.time).toLocaleTimeString();
            return time || 'Invalid Time';
          });

          const entryFlows = data.map((item: any) => {
            const value = parseFloat(item.entryFlow);
            return isNaN(value) ? 0 : value;
          });

          const exitFlows = data.map((item: any) => {
            const value = parseFloat(item.exitFlow);
            return isNaN(value) ? 0 : value;
          });

          setChartData([
            { name: 'Entry Flow', data: entryFlows },
            { name: 'Exit Flow', data: exitFlows },
          ]);

          setChartOptions({
            chart: {
              id: 'quenchFlowChart',
              type: 'area',
              toolbar: { show: false },
              animations: { enabled: true },
              background: '#ffffff',
            },
            xaxis: {
              categories: times,
              labels: { show: false },
              axisTicks: { show: false },
              axisBorder: { show: false },
            },
            yaxis: {
              labels: { show: false },
              axisTicks: { show: false },
              axisBorder: { show: false },
            },
            stroke: {
              curve: 'smooth',
              width: 2,
            },
            fill: {
              type: 'gradient',
              gradient: {
                shade: 'light',
                type: 'vertical',
                gradientToColors: ['#00aaff', '#888888'],
                stops: [0, 100],
              },
            },
            grid: { show: false },
            tooltip: { enabled: true },
            colors: ['#00aaff', '#888888'],
            legend: {
              position: 'top',
              horizontalAlign: 'right', // Align legend to the right
              markers: {
                radius: 12,
              },
            },
          });
        },
        error: (error) => console.error('Error parsing CSV:', error),
      });
    };

    fetchCSVData();
  }, []);

  return (
    <Box
      width="100%"
      height="450px"
      p={4}
      borderRadius="16px"
      boxShadow="md"
      bg="white"
    >
      {chartData.length > 0 && (
        <Chart
          options={chartOptions}
          type="area"
          width="100%"
          height="100%"
          series={chartData}
        />
      )}
    </Box>
  );
};

export default LineAreaChart;
