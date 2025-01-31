// Chakra imports
import { Flex, useColorModeValue } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
import MiniStatistics from 'components/card/MiniStatistics'; // Import the Default component
// Dynamic import for Gauge Component
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const GaugeComponent = dynamic(() => import('react-gauge-component'), { ssr: false });

export default function ClampPressure(props: { [x: string]: any }) {
	const { ...rest } = props;

	// Chakra Color Mode
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'navy.700');

	// State to hold pressure values
	const [pressures, setPressures] = useState({
		clampPressureA: 'N/A',
		clampPressureB: 'N/A',
	});

	// Fetch data from CSV
	useEffect(() => {
		async function fetchData() {
			const response = await fetch('/data/pressure_data.csv'); // Adjust the path if needed
			const text = await response.text();
			const rows = text.split('\n').map(row => row.split(','));
			// Assuming the CSV format: Parameter, ClampPressureA, ClampPressureB
			const latest = rows[rows.length - 3];

			setPressures({
				clampPressureA: parseFloat(latest[1]) || 'N/A',
				clampPressureB: parseFloat(latest[2]) || 'N/A',
			});
		}
		fetchData();
	}, []);

	return (
		<Card p="20px" alignItems="center" flexDirection="row" w="100%" {...rest}>
			<Flex justifyContent="space-around" w="100%">
				{/* Clamp Pressure A */}
				<Flex flexDirection="column" alignItems="center" textAlign="center" mx="10px">
					<GaugeComponent
						id="clamp-pressure-a-gauge"
						value={pressures.clampPressureA === 'N/A' ? 0 : parseFloat(pressures.clampPressureA)}
						minValue={0}
						maxValue={300}
						arc={{
							gradient: true,
							width: 0.15,
							subArcs: [
								{ limit: 100, color: '#EA4228' },
								{ limit: 200, color: '#F5CD19' },
								{ limit: 300, color: '#5BE12C' },
							],
						}}
						pointer={{ type: 'arrow', elastic: true }}
					/>
					<MiniStatistics name="Clamp Pressure A" value={`${pressures.clampPressureA} kPa`} />
				</Flex>

				{/* Clamp Pressure B */}
				<Flex flexDirection="column" alignItems="center" textAlign="center" mx="10px">
					<GaugeComponent
						id="clamp-pressure-b-gauge"
						value={pressures.clampPressureB === 'N/A' ? 0 : parseFloat(pressures.clampPressureB)}
						minValue={0}
						maxValue={300}
						arc={{
							gradient: true,
							width: 0.15,
							subArcs: [
								{ limit: 100, color: '#EA4228' },
								{ limit: 200, color: '#F5CD19' },
								{ limit: 300, color: '#5BE12C' },
							],
						}}
						pointer={{ type: 'arrow', elastic: true }}
					/>
					<MiniStatistics name="Clamp Pressure B" value={`${pressures.clampPressureB} kPa`} />
				</Flex>
			</Flex>
		</Card>
	);
}
