'use client';
/* eslint-disable */

import { useState } from 'react';
import {
  Flex,
  Input,
  Button,
  Text,
  Box,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from '@chakra-ui/react';

export default function PortControl() {
  // Initial port and mill state
  const [portNumber, setPortNumber] = useState<string>('1137');
  const [millId, setMillId] = useState<string>('7');
  const [showAlert, setShowAlert] = useState<boolean>(false);

  // Colors for theme
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' }
  );

  const handleFormSubmit = () => {
    if (!portNumber || !millId) {
      alert('Please provide both port number and mill ID.');
      return;
    }
    // Update the displayed current port and mill ID values
    setShowAlert(true);
  };

  return (
    <Flex
      w={{ base: '100%', md: '100%', xl: '100%' }} // Keep only one width declaration
      pt={{ base: '70px', md: '0px', '2xl': '80px' }}
      direction="column"
      position="relative"
      mx="auto"
      minH={{ base: '75vh', '2xl': '85vh' }}
      maxW="1000px"
    >
      {/* Current Port and Mill ID */}
      <Box mb="20px">
        <Text fontSize="lg" fontWeight="bold">
          Current Port: {portNumber || 'Not set'}
        </Text>
        <Text fontSize="lg" fontWeight="bold">
          Current Mill ID: {millId || 'Not set'}
        </Text>
      </Box>

      {/* Port and Mill ID Form */}
      <Flex direction="column" mt="20px">
        <Input
          placeholder="Enter Port Number"
          value={portNumber}
          onChange={(e) => setPortNumber(e.target.value)}
          mb="10px"
          fontSize="sm"
          borderColor={borderColor}
          borderRadius="45px"
          p="15px"
        />
        <Input
          placeholder="Enter Mill ID"
          value={millId}
          onChange={(e) => setMillId(e.target.value)}
          mb="10px"
          fontSize="sm"
          borderColor={borderColor}
          borderRadius="45px"
          p="15px"
        />
        <Button
          color={'white'}
          fontSize="sm"
          borderRadius="45px"
          bg="linear-gradient(15.46deg, #6C63FF 26.3%, #3F37C9 86.4%)"
          _hover={{
            boxShadow: '0px 10px 20px rgba(60, 50, 200, 0.4)',
          }}
          onClick={handleFormSubmit}
        >
          Update Port & Mill ID
        </Button>
      </Flex>

      {/* Alert Display */}
      {showAlert && (
        <Alert status="success" mt="20px">
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>Port and Mill ID Updated!</AlertTitle>
            <AlertDescription display="block">
              The current port is now {portNumber} and the mill ID is {millId}.
            </AlertDescription>
          </Box>
          <CloseButton
            position="absolute"
            right="8px"
            top="8px"
            onClick={() => setShowAlert(false)}
          />
        </Alert>
      )}
    </Flex>
  );
}