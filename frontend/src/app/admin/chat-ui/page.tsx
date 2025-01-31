'use client';
/eslint-disable/

import { useState } from 'react';
import {
  Flex,
  Img,
  Input,
  Button,
  Icon,
  Text,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdPerson, MdAutoAwesome } from 'react-icons/md';

export default function Chat() {
  // Chat messages state
  const [messages, setMessages] = useState<
    { type: 'user' | 'bot'; text: string }[]
  >([]);
  const [inputCode, setInputCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' }
  );

  const handleTranslate = async () => {
    if (!inputCode) {
      alert('Please enter your message.');
      return;
    }

    setLoading(true);
    setMessages((prev) => [...prev, { type: 'user', text: inputCode }]);

    try {
      const response = await fetch('http://localhost:5005/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: inputCode }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from the server.');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { type: 'bot', text: data.answer }]);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while communicating with the server.');
    } finally {
      setLoading(false);
      setInputCode(''); // Clear the input field after sending
    }
  };

  return (
    <Flex
      w="100%"
      pt={{ base: '70px', md: '0px', '2xl': '80px' }}
      direction="column"
      position="relative"
    >
      <Flex
        direction="column"
        mx="auto"
        w={{ base: '100%', md: '100%', xl: '100%' }}
        minH={{ base: '75vh', '2xl': '85vh' }}
        maxW="1000px"
      >
        {/* Messages Display */}
        <Box overflowY="auto" maxH="500px" w="100%" mb="20px">
          {messages.map((msg, index) => (
            <Flex
              key={index}
              justify={msg.type === 'user' ? 'flex-end' : 'flex-start'}
              mb="10px"
            >
              <Flex
                direction="row"
                align="center"
                maxW="70%"
                bg={
                  msg.type === 'user'
                    ? 'linear-gradient(15.46deg, #6C63FF 26.3%, #3F37C9 86.4%)'
                    : 'whiteAlpha.200'
                }
                borderRadius="14px"
                p="15px"
                boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
              >
                <Icon
                  as={msg.type === 'user' ? MdPerson : MdAutoAwesome}
                  width="20px"
                  height="20px"
                  color={msg.type === 'user' ? 'white' : textColor}
                  me="10px"
                />
                <Text
                  fontWeight="500"
                  color={msg.type === 'user' ? 'white' : textColor}
                  fontSize="sm"
                >
                  {msg.text}
                </Text>
              </Flex>
            </Flex>
          ))}
        </Box>

        {/* Chat Input */}
        <Flex mt="20px">
          <Input
            minH="54px"
            h="100%"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="45px"
            p="15px 20px"
            me="10px"
            fontSize="sm"
            fontWeight="500"
            color={inputColor}
            _placeholder={placeholderColor}
            placeholder="Type your question here..."
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
          />
          <Button
            color={'white'}
            fontSize="sm"
            borderRadius="45px"
            bg="linear-gradient(15.46deg, #6C63FF 26.3%, #3F37C9 86.4%)"
            _hover={{
              boxShadow: '0px 10px 20px rgba(60, 50, 200, 0.4)',
            }}
            onClick={handleTranslate}
            isLoading={loading}
          >
            Submit
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}