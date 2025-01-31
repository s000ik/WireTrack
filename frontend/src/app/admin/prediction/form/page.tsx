'use client';
import {
  Box,
  SimpleGrid,
  useColorModeValue,
  Input,
  FormControl,
  InputGroup,
  InputRightAddon,
  Button,
  Text,
  VStack,
  HStack,
  useToast,
  Spinner,
  Switch,
  Flex,
} from '@chakra-ui/react';
import { useState, useCallback, useEffect, ChangeEvent } from 'react';
import CheckTable from 'views/admin/default/components/CheckTable';
import * as XLSX from 'xlsx';

interface FormValues {
  elongation: string;
  uts: string;
  conductivity: string;
  [key: string]: string;
}

interface TableData {
  parameter: [string]; // Tuple with exactly one string
  original: number;
  difference: number;
  lock: boolean;
  [key: string]: [string] | number | boolean;
}


export default function PredictionForm() {
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('white', 'gray.700');
  const toast = useToast();

  const [values, setValues] = useState<FormValues>({
    elongation: '',
    uts: '',
    conductivity: '',
  });

  const [tableData, setTableData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRealTimePredictionEnabled, setIsRealTimePredictionEnabled] =
    useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const fetchTableData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/final_prediction`);
      if (!response.ok) {
        throw new Error(`Failed to fetch table data: ${response.status}`);
      }

      const data = await response.json();
      if (!data || !data.differences || !data.original) {
        throw new Error('Invalid data format received');
      }

      const updatedTableData = Object.keys(data.differences).map((key) => ({
        parameter: [key] as [string], // Cast single-element array to tuple
        original: data.original[key] || 0,
        difference: data.differences[key] || 0,
        lock: false,
      }));

      setTableData(updatedTableData);
      setError(null);
    } catch (err) {
      console.error('Error fetching table data:', err);
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const saveResponse = await fetch(`${apiUrl}/api/save_features`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.error || 'Failed to save features');
      }

      toast({
        title: 'Success',
        description: 'Features saved successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      await fetchTableData();
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'An unknown error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRealTimePredictionEnabled) {
      interval = setInterval(() => {
        fetchTableData();
      }, 10000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRealTimePredictionEnabled, fetchTableData]);

  const handleDownload = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(tableData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Table Data');
      XLSX.writeFile(workbook, 'PredictionData.xlsx');

      toast({
        title: 'Download Initiated',
        description: 'Your data is being downloaded as an Excel file.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Error',
        description: 'Failed to download data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '100px' }}>
      <HStack spacing="20px" align="start">
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          width="1700px"
          gap="40px"
          mb="20px"
        >
          <Box bg={boxBg} p="20px" borderRadius="20px" shadow="none">
            <FormControl>
              <InputGroup>
                <Input
                  name="uts"
                  value={values.uts}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="Enter Desired UTS"
                />
                <InputRightAddon>MPa</InputRightAddon>
              </InputGroup>
            </FormControl>
          </Box>

          <Box bg={boxBg} p="20px" borderRadius="20px" shadow="none">
            <FormControl>
              <InputGroup>
                <Input
                  name="elongation"
                  value={values.elongation}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="Enter Desired Elongation"
                />
                <InputRightAddon>%</InputRightAddon>
              </InputGroup>
            </FormControl>
          </Box>

          <Box bg={boxBg} p="20px" borderRadius="20px" shadow="none">
            <FormControl>
              <InputGroup>
                <Input
                  name="conductivity"
                  value={values.conductivity}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="Enter Desired Conductivity"
                />
                <InputRightAddon>S/m</InputRightAddon>
              </InputGroup>
            </FormControl>
          </Box>
        </SimpleGrid>
      </HStack>

      <Box display="flex" justifyContent="center" alignItems="center" mt="10px">
        <Button
          colorScheme="brand"
          onClick={handleSubmit}
          mt="12px"
          h="60px"
          w="140px"
          borderRadius="100px"
          isLoading={loading}
        >
          Calculate
        </Button>
      </Box>

      <HStack mt="10px" alignItems="center" justifyContent="center">
        <Text>Real-Time Prediction</Text>
        <Switch
          isChecked={isRealTimePredictionEnabled}
          onChange={() => setIsRealTimePredictionEnabled((prev) => !prev)}
        />
      </HStack>

      {loading && (
        <Flex direction="column" justify="center" align="center" mt="20px">
          <Spinner size="xl" />
          <Text ml="4" mt="4">
            Loading data...
          </Text>
        </Flex>
      )}

      {tableData.length > 0 && (
        <VStack mt="20px" bg={boxBg} p="10px" borderRadius="md">
          <CheckTable tableData={tableData} />
          <Button colorScheme="blue" onClick={handleDownload} mt="4">
            Download Excel
          </Button>
        </VStack>
      )}

      {error && (
        <Text color="red.500" mt="4" textAlign="center">
          {error}
        </Text>
      )}
    </Box>
  );
}
