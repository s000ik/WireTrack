import { Box, Button, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';
import LineChart from 'components/charts/LineChart';
import { useEffect, useState } from 'react';
import { MdOutlineCalendarToday } from 'react-icons/md';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { getLineChartOptions } from 'variables/charts';

export default function TotalSpent(props: { parameter: string }) {
  const { parameter, ...rest } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  // States for fetched values
  const [chartData, setChartData] = useState<any[]>([]);
  const [lastValues, setLastValues] = useState<any[]>([]);

  // Fetch API data every 15 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/dashboard`);
        const { predictions } = await response.json();

        if (predictions) {
          const newData = {
            Coil_No: `Coil ${(chartData.length + 1).toFixed(0)}`, // Increment coil number and keep it as an integer
            [parameter.charAt(0).toUpperCase() + parameter.slice(1)]: parseFloat(predictions[parameter.toLowerCase()]).toFixed(2) // Round parameter value to 2 decimal places
          };

          // Add new data to chart data
          const updatedData = [...chartData, newData];

          setChartData(updatedData);

          // Keep only the last 5 values for display
          const startIndex = updatedData.length > 5 ? updatedData.length - 5 : 0;
          setLastValues(updatedData.slice(startIndex));
        } else {
          console.error('No predictions found in the API response');
        }
      } catch (error) {
        console.error('Error fetching API data:', error);
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 15000); // Poll every 15 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [parameter, chartData]); // Only re-run when parameter changes

  // Calculate rolling average for the last 5 values
  const calculateRollingAverage = (data: any[], parameter: string, windowSize: number) => {
    return data.map((_, index) => {
      const windowStart = Math.max(0, index - windowSize + 1);
      const window = data.slice(windowStart, index + 1);
      const average =
        window.reduce((sum, point) => sum + (parseFloat(point[parameter]) || 0), 0) / window.length;
      return {
        x: data[index].Coil_No,
        y: Math.round((average || 0) * 100) / 100, // Round to two decimal places
      };
    });
  };

  // Calculate rolling average for the last 5 values
  const rollingAverageData = calculateRollingAverage(lastValues, parameter, 3);

  // Line chart data based on selected parameter
  const lineChartData = [
    {
      name: `${parameter} (Actual)`,
      data: lastValues.map((d) => ({
        x: d.Coil_No,
        y: parseFloat(d[parameter]) || 0,
      })),
      color: '#1e3a8a', // Color for the parameter
    },
    {
      name: `${parameter} (Rolling Avg)`,
      data: rollingAverageData,
      color: '#9ca3af', // Gray for rolling average
    },
  ];

  // Get the latest rolling average
  const latestRollingAverage =
    rollingAverageData[rollingAverageData.length - 1]?.y || 'N/A';

  return (
    <Card justifyContent="center" alignItems="center" flexDirection="column" w="100%" mb="0px" {...rest}>
      <Flex justify="space-between" ps="0px" pe="20px" pt="5px" w="100%">
        <Flex align="center" w="100%">
          <Button bg={boxBg} fontSize="sm" fontWeight="500" color={textColorSecondary} borderRadius="7px">
            <Icon as={MdOutlineCalendarToday} color={textColorSecondary} me="4px" />
            {parameter}
          </Button>
        </Flex>
      </Flex>
      <Flex w="100%" flexDirection={{ base: 'column', lg: 'row' }}>
        <Flex flexDirection="column" me="20px" mt="16px">
          <Text color={textColor} fontSize="34px" textAlign="start" fontWeight="700" lineHeight="100%">
            {lastValues[lastValues.length - 1]?.[parameter] || 'N/A'}
          </Text>
          <Flex align="center" mb="20px" mt="6px">
            <Icon as={IoCheckmarkCircle} color="green.500" me="8px" />
            <Text color="secondaryGray.600" fontSize="sm" fontWeight="500">
              Live
            </Text>
          </Flex>
          <Box overflowY="auto" maxH="150px">
            {lastValues.map((data) => (
              <Text key={data.Coil_No} color={textColorSecondary} fontSize="sm" fontWeight="500">
                {data.Coil_No}: {data[parameter]}
              </Text>
            ))}
            <Text color={textColorSecondary} fontSize="sm" fontWeight="500">
              Rolling Avg: {latestRollingAverage}
            </Text>
          </Box>
        </Flex>
        <Box minH="260px" minW="75%" mt="auto">
          <LineChart chartData={lineChartData} chartOptions={getLineChartOptions(lastValues.map(d => d.Coil_No))} />
        </Box>
      </Flex>
    </Card>
  );
}
