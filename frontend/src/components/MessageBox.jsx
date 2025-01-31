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
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import CheckTable from 'views/admin/default/components/CheckTable';

export default function PredictionForm() {
  // const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('white', 'gray.700');
  const toast = useToast();

  const [values, setValues] = useState({
    elongation: '',
    uts: '',
    conductivity: '',
  });

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRealTimePredictionEnabled, setIsRealTimePredictionEnabled] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const fetchTableData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/final_prediction`);
      if (!response.ok) {
        throw new Error('Failed to fetch table data');
      }

      const data = await response.json();
      const updatedTableData = Object.keys(data.differences).map((key) => ({
        parameter: [key],
        original: data.original[key],
        difference: data.differences[key],
        lock: false,
      }));

      setTableData(updatedTableData);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save features
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

      // Fetch updated table data
      fetchTableData();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Real-time prediction logic
  useEffect(() => {
    let interval;
    if (isRealTimePredictionEnabled) {
      interval = setInterval(() => {
        fetchTableData();
      }, 10000); // Update every 10 seconds
    }
    return () => clearInterval(interval);
  }, [isRealTimePredictionEnabled]);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <HStack spacing="20px" align="start">
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          width="1700px"
          gap="40px"
          mb="20px"
        >
          {/* Input Form Cards */}
          <Box bg={boxBg} p="20px" borderRadius="md" shadow="md">
            <FormControl>
              <InputGroup>
                <Input
                  name="uts"
                  value={values.uts}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="Enter Ultimate Tensile Strength"
                />
                <InputRightAddon>MPa</InputRightAddon>
              </InputGroup>
            </FormControl>
          </Box>

          <Box bg={boxBg} p="20px" borderRadius="md" shadow="md">
            <FormControl>
              <InputGroup>
                <Input
                  name="elongation"
                  value={values.elongation}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="Enter Elongation"
                />
                <InputRightAddon>%</InputRightAddon>
              </InputGroup>
            </FormControl>
          </Box>

          <Box bg={boxBg} p="20px" borderRadius="md" shadow="md">
            <FormControl>
              <InputGroup>
                <Input
                  name="conductivity"
                  value={values.conductivity}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="Enter Conductivity"
                />
                <InputRightAddon>S/m</InputRightAddon>
              </InputGroup>
            </FormControl>
          </Box>
        </SimpleGrid>

        {/* Submit Button */}
        <Button
          colorScheme="teal"
          onClick={handleSubmit}
          mt="20px"
          h="50px"
          alignSelf="flex-start"
        >
          Submit
        </Button>
      </HStack>

      {/* Real-Time Prediction Toggle */}
      <HStack mt="20px" alignItems="center">
        <Text>Enable Real-Time Prediction:</Text>
        <Switch
          isChecked={isRealTimePredictionEnabled}
          onChange={() => setIsRealTimePredictionEnabled((prev) => !prev)}
        />
      </HStack>

      {/* Display Loading Spinner */}
      {loading && (
        <HStack mt="20px" justify="center">
          <Spinner size="lg" />
          <Text ml="4">Loading data...</Text>
        </HStack>
      )}

      {/* Display Check Table */}
      {tableData.length > 0 && (
        <VStack mt="20px" bg={boxBg} p="10px" borderRadius="md">
          <CheckTable tableData={tableData} />
        </VStack>
      )}

      {/* Display Error Message */}
      {error && (
        <Text color="red.500" mt="20px">
          {error}
        </Text>
      )}
    </Box>
  );
}