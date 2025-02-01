'use client';

import { useState, useEffect } from 'react';
import {
  Fade,
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
  FormControl,
  SimpleGrid,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
interface AlertData {
  port: string;
  millId: string;
}
export default function PortControl() {
  const [currentPort, setCurrentPort] = useState<string>('1137');
  const [currentMillId, setCurrentMillId] = useState<string>('7');
  const [formPort, setFormPort] = useState<string>('1137');
  const [formMillId, setFormMillId] = useState<string>('7');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertData, setAlertData] = useState<AlertData | null>(null);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);
  // Colors from your theme
  const textColor = useColorModeValue('navy.700', 'white');
  const brandColor = useColorModeValue('brand.500', 'white');
  const borderColor = useColorModeValue('secondaryGray.400', 'whiteAlpha.200');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const handleFormSubmit = () => {
    if (!formPort || !formMillId) {
      alert('Please provide both port number and mill ID.');
      return;
    }
    
    // Update display values
    setCurrentPort(formPort);
    setCurrentMillId(formMillId);
    
    // Set alert data with new values
    setAlertData({ port: formPort, millId: formMillId });
    setShowAlert(true);
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card mb={{ base: '0px', lg: '20px' }} alignItems="center">
        {/* Banner background similar to profile page */}
        <Box
          bgImage="/img/dashboards/Debit.png" // New network-themed image
          bgSize="cover"
          bgPosition="center"
          borderRadius="16px"
          h="131px"
          w="100%"
          position="relative"
        >
          <Flex 
            position="absolute"
            top="0"
            bottom="0"
            left="0"
            right="0"
            align="center"
            justify="center"
            bg="blackAlpha.300" // Dark overlay for better text visibility
            borderRadius="16px"
          >
            <Text
              color="white"
              fontSize="3xl"
              fontWeight="bold"
              textShadow="0px 2px 4px rgba(0, 0, 0, 0.25)"
            >
              Port Control
            </Text>
          </Flex>
        </Box>

        <Box w="100%" mt="20px">
          <Flex direction="column" p="20px">
            {/* Current Settings Display */}
            <Flex 
              bg={boxBg} 
              p="16px" 
              borderRadius="16px" 
              mb="20px"
              direction="column"
            >
              <Text color={textColor} fontSize="lg" fontWeight="700" mb="16px">
                Current Configuration
              </Text>
              <SimpleGrid columns={2} spacing={8}>
                <Box>
                  <Text color={textColor} fontSize="xs" textTransform="uppercase" mb="4px">
                    Port Number
                  </Text>
                  <Text color={brandColor} fontSize="md" fontWeight="500">
      {currentPort || 'Not set'}
    </Text>
                </Box>
                <Box>
                  <Text color={textColor} fontSize="xs" textTransform="uppercase" mb="4px">
                    Mill ID
                  </Text>
                  <Text color={brandColor} fontSize="md" fontWeight="500">
      {currentMillId || 'Not set'}
    </Text>
                </Box>
              </SimpleGrid>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb="24px">
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="600" mb="8px">
                  Port Number
                </Text>
                <Input
                  variant="main"
                  placeholder="Enter Port Number"
                  value={formPort}
      onChange={(e) => setFormPort(e.target.value)}
                  fontSize="sm"
                  bg="white"
                  borderColor={borderColor}
                  _focus={{ borderColor: brandColor }}
                />
              </FormControl>
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="600" mb="8px">
                  Mill ID
                </Text>
                <Input
                  variant="main"
                  placeholder="Enter Mill ID"
                  value={formMillId}
      onChange={(e) => setFormMillId(e.target.value)}
                  fontSize="sm"
                  bg="white"
                  borderColor={borderColor}
                  _focus={{ borderColor: brandColor }}
                />
              </FormControl>
            </SimpleGrid>

            <Button
              variant="brand"
              fontSize="sm"
              fontWeight="500"
              w={{ base: "100%", md: "200px" }}
              h="50px"
              mx="auto"
              onClick={handleFormSubmit}
            >
              Update Settings
            </Button>

            {/* Alert */}
            {showAlert && (
  <Fade in={showAlert}>
    <Alert status="success" borderRadius="16px" mt="20px">
      <AlertIcon />
      <Box flex="1">
        <AlertTitle>Settings Updated!</AlertTitle>
        <AlertDescription display="block">
          Port: {alertData?.port}, Mill ID: {alertData?.millId}
        </AlertDescription>
      </Box>
      <CloseButton
        position="absolute"
        right="8px"
        top="8px"
        onClick={() => setShowAlert(false)}
      />
    </Alert>
  </Fade>
)}
          </Flex>
        </Box>
      </Card>
    </Box>
  );
}