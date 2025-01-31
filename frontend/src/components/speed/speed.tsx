import React, { useState, useEffect } from "react";
import ReactSpeedometer from "react-d3-speedometer";
import Papa from "papaparse";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

const Speed = () => {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rollingMillSpeed, setRollingMillSpeed] = useState(0);
  const [castWheelSpeed, setCastWheelSpeed] = useState(0);

  useEffect(() => {
    // Fetch and parse CSV data
    const fetchData = async () => {
      const response = await fetch("/data/speed.csv");
      const reader = response.body.getReader();
      const result = await reader.read(); // Read raw bytes
      const decoder = new TextDecoder("utf-8");
      const csv = decoder.decode(result.value);
      const parsed = Papa.parse(csv, { header: true });
      setData(parsed.data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Simulate live updates from the CSV data
    if (data.length > 0) {
      const interval = setInterval(() => {
        const index = currentIndex % data.length; // Loop through data
        setRollingMillSpeed(Number(data[index].rollingMillSpeed));
        setCastWheelSpeed(Number(data[index].castWheelSpeed));
        setCurrentIndex(index + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [data, currentIndex]);

  return (
    <Box bg="white" minHeight="30vh" p={8} borderRadius="2xl">
      <Flex justify="space-around" align="center" wrap="wrap">
        {/* Rolling Mill Speed */}
        <Box textAlign="center" p={4} boxShadow="md" borderRadius="lg" bg="gray.50">
          <Heading as="h3" size="md" mb={4}>
            Rolling Mill Speed (RPM)
          </Heading>
          <ReactSpeedometer
            maxValue={500}
            value={rollingMillSpeed}
            needleColor="red"
            startColor="green"
            endColor="blue"
            segments={10}
          />
          <Text mt={4} fontSize="lg" fontWeight="bold" color="gray.700">
            {rollingMillSpeed} RPM
          </Text>
        </Box>

        {/* Cast Wheel Speed */}
        <Box textAlign="center" p={4} boxShadow="md" borderRadius="lg" bg="gray.50">
          <Heading as="h3" size="md" mb={4}>
            Cast Wheel Speed (RPM)
          </Heading>
          <ReactSpeedometer
            maxValue={300}
            value={castWheelSpeed}
            needleColor="steelblue"
            startColor="skyblue"
            endColor="orange"
            segments={8}
          />
          <Text mt={4} fontSize="lg" fontWeight="bold" color="gray.700">
            {castWheelSpeed} RPM
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default Speed;
