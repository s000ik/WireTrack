import {
	Box,
	Flex,
	Text,
	useColorModeValue,
	Button,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	FormControl,
	FormLabel,
	NumberInput,
	NumberInputField,
  } from "@chakra-ui/react";
  import Card from "components/card/Card";
  import PieChart from "components/charts/PieChart";
  import { useState, useEffect } from "react";
  
  export default function Conversion(props: { [x: string]: any }) {
	const { ...rest } = props;
  
	const textColor = useColorModeValue("secondaryGray.900", "white");
	const cardColor = useColorModeValue("white", "navy.700");
	const cardShadow = useColorModeValue(
	  "0px 18px 40px rgba(112, 144, 176, 0.12)",
	  "unset"
	);
  
	const { isOpen, onOpen, onClose } = useDisclosure();
  
	const [alPercentage, setAlPercentage] = useState<number>(99.2);
	const [impurities, setImpurities] = useState([
	  { name: "Si", value: 0.06 },
	  { name: "Fe", value: 0.2 },
	  { name: "Ti", value: 0.02 },
	  { name: "V", value: 0.06 },
	]);
  
	useEffect(() => {
	  // Check if there is any saved data in localStorage
	  const savedAlPercentage = localStorage.getItem("alPercentage");
	  const savedImpurities = localStorage.getItem("impurities");
  
	  if (savedAlPercentage && savedImpurities) {
		setAlPercentage(parseFloat(savedAlPercentage));
		setImpurities(JSON.parse(savedImpurities));
	  }
	}, []);
  
	const handleInputChange = (index: number, value: number) => {
	  const newImpurities = [...impurities];
	  newImpurities[index].value = value;
	  setImpurities(newImpurities);
	};
  
	const calculateRemaining = () => {
	  const impurityTotal = impurities.reduce(
		(sum, imp) => sum + parseFloat(imp.value || "0"),
		0
	  );
	  return (100 - impurityTotal).toFixed(2);
	};
  
	const handleSave = () => {
	  const remaining = calculateRemaining();
	  setAlPercentage(parseFloat(remaining));
	  
	  // Save the values to localStorage
	  localStorage.setItem("alPercentage", remaining);
	  localStorage.setItem("impurities", JSON.stringify(impurities));
	  
	  // Reload the page to reflect changes
	  window.location.reload();
	};
  
	return (
	  <Card p="20px" alignItems="center" flexDirection="column" w="100%" {...rest}>
		<Flex
		  px={{ base: "0px", "2xl": "10px" }}
		  justifyContent="space-between"
		  alignItems="center"
		  w="100%"
		  mb="8px"
		>
		  <Text color={textColor} fontSize="md" fontWeight="600" mt="4px">
			Chemical Composition
		  </Text>
		  <Button fontSize="sm" variant="outline" onClick={onOpen}>
			Update
		  </Button>
		</Flex>
  
		<PieChart
		  h="100%"
		  w="100%"
		  chartData={impurities.map((item) => parseFloat(item.value))}
		  chartOptions={{
			labels: impurities.map((item) => item.name),
		  }}
		/>
  
		<Card
		  bg={cardColor}
		  flexDirection="row"
		  boxShadow={cardShadow}
		  w="100%"
		  p="15px"
		  px="20px"
		  mt="15px"
		  mx="auto"
		>
		  <Flex direction="column" py="5px" me="10px">
			<Flex align="center">
			  <Box h="8px" w="8px" bg="#3182CE" borderRadius="50%" me="4px" />
			  <Text fontSize="xs" color="secondaryGray.600" fontWeight="700" mb="5px">
				Aluminium
			  </Text>
			</Flex>
			<Text fontSize="lg" color={textColor} fontWeight="700">
			  {alPercentage}%
			</Text>
		  </Flex>
		  {impurities.map((item, index) => (
			<Flex direction="column" py="5px" key={index} me="10px">
			  <Flex align="center">
				<Box h="8px" w="8px" bg="#CBD5E0" borderRadius="50%" me="4px" />
				<Text fontSize="xs" color="secondaryGray.600" fontWeight="700" mb="5px">
				  {item.name}
				</Text>
			  </Flex>
			  <Text fontSize="lg" color={textColor} fontWeight="700">
				{item.value}%
			  </Text>
			</Flex>
		  ))}
		</Card>
  
		<Modal
		  isOpen={isOpen}
		  onClose={onClose} // Use default onClose
		  size="sm"
		>
		  <ModalOverlay />
		  <ModalContent>
			<ModalHeader>Update Composition</ModalHeader>
			<ModalCloseButton />
			<ModalBody>
			  {impurities.map((item, index) => (
				<FormControl key={index} mb="4">
				  <FormLabel>{item.name}</FormLabel>
				  <NumberInput
					defaultValue={item.value}
					min={0}
					max={100}
					onChange={(value) => handleInputChange(index, parseFloat(value) || 0)}
				  >
					<NumberInputField />
				  </NumberInput>
				</FormControl>
			  ))}
			</ModalBody>
			<ModalFooter>
			  <Button colorScheme="blue" onClick={handleSave}>
				Save
			  </Button>
			</ModalFooter>
		  </ModalContent>
		</Modal>
	  </Card>
	);
  }
  