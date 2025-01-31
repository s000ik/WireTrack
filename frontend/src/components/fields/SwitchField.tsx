import { Box, Flex, FormLabel, Switch, Text, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';

export default function Default(props: {
	id: string;
	label?: string;
	isChecked?: boolean;
	onChange?: (isChecked: boolean) => void;
	desc?: string;
	textWidth?: string | number;
	reversed?: boolean;
	[x: string]: any;
}) {
	const { id, label, isChecked = false, onChange, desc, textWidth, reversed, fontSize, ...rest } = props;

	const [switchState, setSwitchState] = useState(isChecked);

	const handleToggle = () => {
		setSwitchState(!switchState);
		if (onChange) {
			onChange(!switchState);
		}
	};

	const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
	const switchColorScheme = switchState ? 'blue' : 'brandScheme';

	return (
		<Box w="100%" fontWeight="500" {...rest}>
			{reversed ? (
				<Flex align="center" borderRadius="16px">
					<Switch
						isChecked={switchState}
						id={id}
						variant="main"
						colorScheme={switchColorScheme}
						size="md"
						onChange={handleToggle}
					/>
					<FormLabel
						ms="15px"
						htmlFor={id}
						_hover={{ cursor: 'pointer' }}
						flexDirection="column"
						mb="0px"
						maxW={textWidth ? textWidth : '75%'}>
						<Text color={textColorPrimary} fontSize="md" fontWeight="500">
							{label}
						</Text>
						<Text color="secondaryGray.600" fontSize={fontSize ? fontSize : 'md'}>
							{desc}
						</Text>
					</FormLabel>
				</Flex>
			) : (
				<Flex justify="space-between" align="center" borderRadius="16px">
					<FormLabel
						htmlFor={id}
						_hover={{ cursor: 'pointer' }}
						flexDirection="column"
						maxW={textWidth ? textWidth : '75%'}>
						<Text color={textColorPrimary} fontSize="md" fontWeight="500">
							{label}
						</Text>
						<Text color="secondaryGray.600" fontSize={fontSize ? fontSize : 'md'}>
							{desc}
						</Text>
					</FormLabel>
					<Switch
						isChecked={switchState}
						id={id}
						variant="main"
						colorScheme={switchColorScheme}
						size="md"
						onChange={handleToggle}
					/>
				</Flex>
			)}
		</Box>
	);
}
