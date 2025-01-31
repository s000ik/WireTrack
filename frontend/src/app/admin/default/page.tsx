'use client';
import {
  Box,
  SimpleGrid,
  useColorModeValue,
  Flex,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useState, useCallback, useEffect } from 'react';
// Add this import
import TotalSpent from 'views/admin/default/components/TotalSpent';
import LineAreaChart from 'components/charts/LineAreaChart';
import Speed from 'components/speed/speed';
import PieCard from 'views/admin/default/components/PieCard';
import WeeklyRevenue from 'views/admin/default/components/WeeklyRevenue';
import SwitchField from 'components/fields/SwitchField';
// Add PressureTemp import if you're using it
import PressureTemp from 'components/pressuretemp/pressuretemp';
import CheckTable from 'views/admin/default/components/CheckTable';
import ComplexTable from 'views/admin/default/components/ComplexTable';
import tableDataComplex from 'views/admin/default/variables/tableDataComplex';

export default function Default() {
  // Remove duplicate declarations
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const [utsValue, setUtsValue] = useState(null);
  const [elongationValue, setElongationValue] = useState(null);
  const [conductivityValue, setConductivityValue] = useState(null);
  const [tableDataCheck, setTableDataCheck] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRealTimePredictionEnabled, setIsRealTimePredictionEnabled] =
    useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const [tableDataComplex, setTableDataComplex] = useState([
    {
      name: 'Initial Data',
      status: 'Approved',
      date: new Date().toLocaleDateString(),
      progress: 0
    }
  ]);

  // Fetch prediction data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/final_prediction`);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      setUtsValue(data.predictions?.uts || 0);
      setElongationValue(data.predictions?.elongation || 0);
      setConductivityValue(data.predictions?.conductivity || 0);
    } catch (error) {
      console.error('Error fetching prediction data:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

    // Fetch table data
    const fetchTableData = useCallback(async () => {
      try {
        const response = await fetch(`${apiUrl}/api/final_prediction`);
        if (!response.ok) {
          throw new Error(`Failed to fetch table data: ${response.status}`);
        }
  
        const data = await response.json();
        if (!data || !data.differences || !data.original) {
          throw new Error('Invalid table data format received');
        }
  
        const updatedTableData = Object.keys(data.differences).map((key) => ({
          parameter: [key],
          original: data.original?.[key] || 0,
          difference: data.differences?.[key] || 0,
          lock: false,
        }));
  
        setTableDataCheck(updatedTableData);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Error fetching table data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setTableDataCheck([]); // Set empty table on error
      }
    }, [apiUrl]);

    // Initial data fetch
    useEffect(() => {
      const initialFetch = async () => {
        try {
          await Promise.all([fetchData(), fetchTableData()]);
        } catch (error) {
          console.error('Error during initial data fetch:', error);
        }
      };
      initialFetch();
    }, [fetchData, fetchTableData]);

  // Real-time prediction toggle effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRealTimePredictionEnabled) {
      interval = setInterval(async () => {
        try {
          await Promise.all([fetchData(), fetchTableData()]);
        } catch (error) {
          console.error('Error during real-time update:', error);
        }
      }, 10000); // Fetch every 10 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRealTimePredictionEnabled, fetchData, fetchTableData]);

  // Loading state
  if (loading && !tableDataCheck.length) {
    return (
      <Flex direction="column" justify="center" align="center" h="100vh">
        <Spinner size="xl" />
        <Text ml="4" mt="4">Loading data...</Text>
        {error && (
          <Text color="red.500" mt="4">
            {error}
          </Text>
        )}
      </Flex>
    );
  }

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* {error && (
        <Box bg="red.100" p={4} mb={4} borderRadius="md">
          <Text color="red.500">{error}</Text>
        </Box>
      )} */}
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, '2xl': 3 }}
        gap="20px"
        mb="20px"
      >
        <TotalSpent parameter="UTS" />
        <TotalSpent parameter="Elongation" />
        <TotalSpent parameter="Conductivity" />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap="20px" mb="20px">
        <PressureTemp parameterSet={1} />
        <PressureTemp parameterSet={2} />
        <PressureTemp parameterSet={3} />
        <PressureTemp parameterSet={4} />
      </SimpleGrid>
      {/* <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <CheckTable tableData={tableDataCheck} />
        <ComplexTable tableData={tableDataComplex} />
      </SimpleGrid> */}
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        <LineAreaChart />
        <Speed />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <SimpleGrid columns={{ base: 1, md: 2, xl: 1 }} gap="20px">
          <PieCard />
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 2, xl: 1 }} gap="20px">
          <WeeklyRevenue />
        </SimpleGrid>
        <SwitchField
          reversed={true}
          fontSize="sm"
          mb="20px"
          id="2"
          label="Real Time Monitoring"
          isChecked={isRealTimePredictionEnabled}
          onChange={() => setIsRealTimePredictionEnabled((prev) => !prev)}
        />
      </SimpleGrid>
    </Box>
  );
}
