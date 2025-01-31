'use client';
import { Box, Text, Image, VStack } from '@chakra-ui/react';
import React from 'react';

export default function DataTables() {
  const edaImages = [
    { src: '/img/EDA/Corr_heatmap.png', text: 'Correlation Heatmap' },
    { src: '/img/EDA/Conductivity.png', text: 'Feature Importance for Conductivity' },
    { src: '/img/EDA/Elongation.png', text: 'Feature Importance for Elongation' },
    { src: '/img/EDA/UTS.png', text: 'Feature Importance for UTS' },
    { src: '/img/EDA/all_features.png', text: 'Box Plot of Distribution' },
    { src: '/img/EDA/feature_dist.png', text: 'Feature Distribution' },
    { src: '/img/EDA/target_distribution.png', text: 'Target Distribution' },
  ];

  const chemicalCompositionImages = [
    { src: '/img/EDA/impurity_combined.png', text: 'Correlation Heatmap for Chemical Composition' },
    { src: '/img/EDA/impurity_conductivity.png', text: 'Effect of Impurity on Conductivity' },
    { src: '/img/EDA/Impurity_Elongation.png', text: 'Effect of Impurity on Elongation' },
    { src: '/img/EDA/impurity_UTS.png', text: 'Effect of Impurity on UTS' },
    { src: '/img/EDA/impurity_distribution.png', text: 'Impurity Distribution' },
  ];

  return (
    <Box mt="80px" bg="none" py="20px">
      {/* First Card */}
      <Box
        borderRadius="20px"
        bg="white"
        boxShadow="sm"
        mx={{ base: '20px', lg: '40px' }}
        py="20px"
        mb="40px"
      >
        <Text fontSize="2xl" fontWeight="bold" mb="20px" mx="40px" textAlign="left">
          Exploratory Data Analysis
        </Text>
        <Box w="100%" h="1px" bg="gray.200" mb="20px" />
        <VStack spacing={8} align="stretch">
          {edaImages.map((image, index) => (
            <Box
              px={{ base: '20px', lg: '80px' }}
              key={index}
              bg="white"
              borderRadius="15px"
              boxShadow="none"
              overflow="hidden"
              textAlign="center"
              p="20px"
            >
              <Image
                src={image.src}
                alt={`EDA Image ${index + 1}`}
                objectFit="cover"
                w="100%"
                borderRadius="12px"
                mb="15px"
              />
              <Text fontSize="md" color="gray.700" fontWeight="medium">
                {image.text}
              </Text>
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Second Card */}
      <Box
        borderRadius="20px"
        bg="white"
        boxShadow="sm"
        mx={{ base: '20px', lg: '40px' }}
        py="20px"
      >
        <Text fontSize="2xl" fontWeight="bold" mb="20px" mx="40px" textAlign="left">
          Chemical Composition EDA
        </Text>
        <Box w="100%" h="1px" bg="gray.200" mb="20px" />
        <VStack spacing={8} align="stretch">
          {chemicalCompositionImages.map((image, index) => (
            <Box
              px={{ base: '20px', lg: '120px' }}
              key={index}
              bg="white"
              borderRadius="15px"
              boxShadow="none"
              overflow="hidden"
              textAlign="center"
              p="20px"
            >
              <Image
                src={image.src}
                alt={`Chemical Composition Image ${index + 1}`}
                objectFit="cover"
                w="100%"
                borderRadius="12px"
                mb="15px"
              />
              <Text fontSize="md" color="gray.700" fontWeight="medium">
                {image.text}
              </Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}
