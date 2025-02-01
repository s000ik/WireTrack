'use client';
/eslint-disable/

import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
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
  const toast = useToast();
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
  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTranslate();
    }
  };
  const handleTranslate = async () => {
    if (!inputCode) {
      toast({
        title: "Empty message",
        description: "Please enter your message.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });
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

      if (!response.ok) throw new Error('Server offline');

      const data = await response.json();
      setMessages((prev) => [...prev, { type: 'bot', text: data.answer }]);
    } catch (error) {
      toast({
        title: "Server Offline",
        description: "The chatbot server is currently unavailable.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right"
      });
    } finally {
      setLoading(false);
      setInputCode('');
    }
  };

  return (
    <Flex
      w="100%"
      pt={{ base: '70px', md: '0px', '2xl': '80px' }}
      direction="column"
      position="relative"
      minH="100vh"
    >
         {/* Background Icon */}
    <Flex
      position="fixed"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      opacity={0.1}
      zIndex={0}
      pointerEvents="none"
    >
      <Icon
        as={MdAutoAwesome}
        width="400px"
        height="400px"
        color="gray.400"
      />
    </Flex>
      <Flex
        direction="column"
        mx="auto"
        w="100%"
        maxW="1000px"
        px="20px"
        position="relative"
      >
        {/* Messages Display */}
        <Box
          overflowY="auto"
          maxH="calc(100vh - 250px)"  // Adjust for input height
          w="100%"
          mb="20px"
          pb="120px"  // Add space for input
        >
          {messages.map((msg, index) => (
            <Flex
              key={index}
              justify={msg.type === 'user' ? 'flex-end' : 'flex-start'}
              mb="10px"
              w="100%"
              pr={msg.type === 'user' ? '150px' : '0'} // Add 100px padding for user messages
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
        <Flex
          position="fixed"
          bottom="100px"
          left="50%"
          transform="translateX(-50%)"
          width="100%"
          maxW="960px"
          zIndex={2}
        >
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
            bg={useColorModeValue('white', 'gray.800')} // Added bg here
            _placeholder={placeholderColor}
            placeholder="Type your question here..."
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <Button
            variant="solid"
            minH="54px"
            color="white"
            fontSize="sm"
            fontWeight="500"
            borderRadius="45px"
            px="24px"
            bg="linear-gradient(15.46deg, #6C63FF 26.3%, #3F37C9 86.4%)"
            _hover={{
              bg: "linear-gradient(15.46deg, #5B52FF 26.3%, #2E26B8 86.4%)",
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