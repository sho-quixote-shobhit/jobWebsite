import React, { useEffect } from 'react'
import axios from 'axios';
import { Box, Skeleton, Stack, Text, useToast } from '@chakra-ui/react';
import { useChat } from '../../providers/chatContext';
import { useUser } from '../../providers/userContext';

const MyChats = ({fetchAgain}) => {

    const { selectedChat, setselectedChat, chats, setchats  } = useChat();
    const {user} = useUser();
    const toast = useToast()

    useEffect(() => {
        const fetchChats = async () => {
            try {
                await axios.get('http://localhost:5000/chat/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                    }
                }).then(res => {
                    setchats(res.data.chats)
                })
            } catch (error) {
                toast({
                    title: 'Failed to load chats',
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                })
            }
        }
        fetchChats()
    }, [fetchAgain , setchats])

    const getsender = (users) => {
        return users[0]._id === user._id ? users[1].name : users[0].name
    }

    return (
        <>
            <Box
                display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
                flexDir='column'
                alignItems='center'
                p={3}
                bg='white'
                w={{ base: '100%', md: '31%' }}
                borderRadius='lg'
                borderWidth='1px'
            >
                {/* heading and group icon */}
                <Box
                    pb={3}
                    px={3}
                    fontSize={{ base: '22px', md: '25px' }}
                    display='flex'
                    w="100%"
                    justifyContent='space-between'
                    alignItems='center'
                >
                    My Chats
                </Box>

                {/* displaying chatted users with */}
                <Box
                    display='flex'
                    flexDir='column'
                    p={3}
                    bg='#F8F8F8'
                    w="100%"
                    h="100%"
                    borderRadius="lg"
                    overflow='hidden'
                >
                    {chats ?
                        (<>
                            <Stack overflowY='scroll'>
                                {chats.map((chat) => {
                                    return (
                                        <Box
                                            onClick={() => setselectedChat(chat)}
                                            cursor='pointer'
                                            bg={selectedChat === chat ? '#38B2Ac' : '#E8E8E8'}
                                            color={selectedChat === chat ? 'white' : 'black'}
                                            px={3}
                                            py={3}
                                            borderRadius='lg'
                                            key={chat._id}
                                        >
                                            <Text m='auto auto'>{getsender(chat.users)}</Text>
                                        </Box>
                                    )
                                })}
                            </Stack>
                        </>)
                        : (<>
                            <Stack>
                                <Skeleton height='30px' />
                                <Skeleton height='30px' />
                                <Skeleton height='30px' />
                                <Skeleton height='30px' />
                                <Skeleton height='30px' />
                                <Skeleton height='30px' />
                            </Stack>

                        </>)}
                </Box>
            </Box>
        </>
    )
}

export default MyChats