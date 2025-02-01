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
import Card from 'components/card/Card';
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
  const toast = useToast();
  const textColorPrimary = useColorModeValue('brand.500', 'white');
  const textColorSecondary = 'gray.400';
  const boxBg = useColorModeValue('secondaryGray.300', 'gray.700');
  const brandColor = useColorModeValue('brand.500', 'white');


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
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card mb={{ base: '0px', lg: '20px' }} alignItems="center">
        {/* Banner background similar to profile page */}
        <Box
          bgImage="/img/auth/banner.png"
          bgSize="cover"
          borderRadius="16px"
          h="131px"
          w="100%"
        />

        <Box w="100%" mt="-40px">
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            gap="20px"
            mb="20px"
            mx="auto"
            px="20px"
          >
            <FormControl bg={boxBg} p="16px" borderRadius="16px">
              <Text color={textColorSecondary} fontSize="sm" mb="4px">
                Ultimate Tensile Strength
              </Text>
              <InputGroup size="md">
                <Input
                  variant="main"
                  name="uts"
                  value={values.uts}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="Enter UTS"
                  fontSize="sm"
                />
                <InputRightAddon children="MPa" bg={boxBg} color={textColorSecondary} />
              </InputGroup>
            </FormControl>

            <FormControl bg={boxBg} p="16px" borderRadius="16px">
              <Text color={textColorSecondary} fontSize="sm" mb="4px">
                Elongation
              </Text>
              <InputGroup size="md">
                <Input
                  variant="main"
                  name="elongation"
                  value={values.elongation}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="Enter Elongation"
                  fontSize="sm"
                />
                <InputRightAddon children="%" bg={boxBg} color={textColorSecondary} />
              </InputGroup>
            </FormControl>

            <FormControl bg={boxBg} p="16px" borderRadius="16px">
              <Text color={textColorSecondary} fontSize="sm" mb="4px">
                Conductivity
              </Text>
              <InputGroup size="md">
                <Input
                  variant="main"
                  name="conductivity"
                  value={values.conductivity}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="Enter Conductivity"
                  fontSize="sm"
                />
                <InputRightAddon children="S/m" bg={boxBg} color={textColorSecondary} />
              </InputGroup>
            </FormControl>
          </SimpleGrid>

          <Flex direction="column" align="center" px="20px" mb="20px">
            <Button
              variant="brand"
              onClick={handleSubmit}
              minH="46px"
              w={{ base: "100%", md: "200px" }}
              fontSize="sm"
              fontWeight="500"
              isLoading={loading}
              mb="12px"
            >
              Calculate
            </Button>

            <HStack spacing="12px" align="center">
              <Text color={textColorSecondary} fontSize="sm">
                Real-Time Prediction
              </Text>
              <Switch
                colorScheme="brand"
                isChecked={isRealTimePredictionEnabled}
                onChange={() => setIsRealTimePredictionEnabled((prev) => !prev)}
              />
            </HStack>
          </Flex>

          {loading && (
            <Flex direction="column" justify="center" align="center" my="20px">
              <Spinner size="xl" color={brandColor} />
              <Text color={textColorSecondary} fontSize="sm" mt="4">
                Loading data...
              </Text>
            </Flex>
          )}

          {tableData.length > 0 && (
            <Card bg={boxBg} mx="20px" mb="20px" p="20px">
              <CheckTable tableData={tableData} />
              <Button
                variant="brand"
                onClick={handleDownload}
                mt="4"
                w={{ base: "100%", md: "auto" }}
              >
                Download Excel
              </Button>
            </Card>
          )}

          {error && (
            <Text color="red.500" fontSize="sm" mt="4" textAlign="center">
              {error}
            </Text>
          )}
        </Box>
      </Card>
    </Box>
  );
}