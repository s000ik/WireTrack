// Chakra imports
import { Box, Flex, Text, useColorModeValue, Heading } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
import MiniStatistics from 'components/card/MiniStatistics'; // Import the Default component
// Thermometer component
import Thermometer from 'react-thermometer-component';
import { useEffect, useState } from 'react';
import React from 'react';

export default function Conversion(props: { [x: string]: any }) {
	const { ...rest } = props;

	// Chakra Color Mode
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'navy.700');

	// State to hold temperature values
	const [temperatures, setTemperatures] = useState({
		rollingMillTemp: 'N/A',
		castingTemp: 'N/A',
		tundishTemp: 'N/A',
	});

	// Fetch data from CSV
	useEffect(() => {
		async function fetchData() {
			const response = await fetch('/data/temperature_data.csv'); // Adjust the path if needed
			const text = await response.text();
			const rows = text.split('\n').map(row => row.split(','));
			// Assuming the CSV format: Parameter, Value
			const latest = rows[rows.length - 2];

			const rollingMillTemp = parseFloat(latest[1]) || NaN;
			const castingTemp = parseFloat(latest[2]) || NaN;
			const tundishTemp = parseFloat(latest[3]) || NaN;

			setTemperatures({
				rollingMillTemp: rollingMillTemp || 'N/A',
				castingTemp: castingTemp || 'N/A',
				tundishTemp: tundishTemp || 'N/A',
			});
		}
		fetchData();
	}, []);

	return (
		<Card p="20px" alignItems="center" flexDirection="row" w="100%" {...rest}>
			<Flex justifyContent="space-around" w="100%">
				{/* Rolling Mill */}
				<Flex flexDirection="column" alignItems="center" textAlign="center" mx="10px">
					<Thermometer
						theme="light"
						value={temperatures.rollingMillTemp === 'N/A' ? 0 : parseFloat(temperatures.rollingMillTemp)}
						max="1600"
						steps="5"
						format="°C"
						size="large"
						height="300"
					/>
					<MiniStatistics
						name="Rolling Mill Temperature"
						value={`${temperatures.rollingMillTemp} °C`}
						style={{
							fontSize: '20px',
							padding: '10px',
						}}
					/>
				</Flex>

				{/* Casting */}
				<Flex flexDirection="column" alignItems="center" textAlign="center" mx="10px">
					<Thermometer
						theme="light"
						value={temperatures.castingTemp === 'N/A' ? 0 : parseFloat(temperatures.castingTemp)}
						max="1600"
						steps="5"
						format="°C"
						size="large"
						height="300"
					/>
					<MiniStatistics
						name="Casting Temperature"
						value={`${temperatures.castingTemp} °C`}
						style={{
							fontSize: '20px',
							padding: '10px',
						}}
					/>
				</Flex>

				{/* Tundish */}
				<Flex flexDirection="column" alignItems="center" textAlign="center" mx="10px">
					<Thermometer
						theme="light"
						value={temperatures.tundishTemp === 'N/A' ? 0 : parseFloat(temperatures.tundishTemp)}
						max="1600"
						steps="5"
						format="°C"
						size="large"
						height="300"
					/>
					<MiniStatistics
						name="Tundish Temperature"
						value={`${temperatures.tundishTemp} °C`}
						style={{
							fontSize: '20px',
							padding: '10px',
						}}
					/>
				</Flex>
			</Flex>
		</Card>
	);
}
