// Chakra imports
import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';
// Custom components
import SwitchField from 'components/fields/SwitchField';
import Menu from 'components/menu/MainMenu';

export default function Notifications(props: { [x: string]: any }) {
	const { ...rest } = props;
	// Chakra Color Mode
	const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
	return (
		<Card mb='20px' {...rest}>
			<Flex align='center' w='100%' justify='space-between' mb='30px'>
				<Text color={textColorPrimary} fontWeight='bold' fontSize='2xl' mb='4px'>
					Alerts
				</Text>
				<Menu />
			</Flex>
			<SwitchField
	
				reversed={true}
				fontSize='sm'
				mb='20px'
				id='1'
				label='Abnormal range notifications	'
			/>
			<SwitchField reversed={true} fontSize='sm' mb='20px' id='2' label='Anomaly Detection' />
			<SwitchField reversed={true} fontSize='sm' mb='20px' id='3' label='Parameter Optimization Recommendation' />
			<SwitchField reversed={true} fontSize='sm' mb='20px' id='4' label='Rolling Stand Efficiency Alertss' />
			<SwitchField reversed={true} fontSize='sm' mb='20px' id='5' label='Maintenance Alerts' />
			<SwitchField reversed={true} fontSize='sm' mb='20px' id='6' label='Monthly Quality Trends' />
		</Card>
	);
}
