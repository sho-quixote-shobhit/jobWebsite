import { Box, Button, FormControl, FormLabel, Input, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useUser } from '../../providers/userContext'
import { useChat } from '../../providers/chatContext'
import { useNavigate } from 'react-router-dom'

const JoinMeeting = () => {
    const { user } = useUser()
    const { setselectedChat } = useChat();
    const [meetId , setmeetId] = useState('')
    const navigate = useNavigate();


    useEffect(() => {
        setselectedChat('')
    })

    const handlesubmit = () => {
        navigate(`/meeting/${meetId}`)
    }

    return (
        <Box w={{ base: '90%', md: '70%' }} m='auto auto' display='flex' justifyContent='center' alignItems='center' h='90vh'>
            <Box m='auto auto' w={{ base: '90%', md: '70%' , lg : '40%' }}
                display='flex' flexDir='column'
                justifyContent='center'
                alignItems='center'
                border='1px solid #D3D3D3'
                borderRadius='10px'
                h='60vh'
                boxShadow="5px 5px 5px 5px pink"
            >
                <Text my={4} fontSize='3xl'>Join Video Call</Text>
                {user &&
                    <Box w='80%'>
                        <FormControl as='form' onSubmit={handlesubmit}>
                            <FormLabel fontSize='xl'>Enter MeetId</FormLabel>
                            <Input type='text' onChange={(e)=>{setmeetId(e.target.value)}} placeholder='123456 , ...' />
                            <Button type='submit' mt={3} colorScheme='pink'>Join Meeting</Button>
                        </FormControl>
                    </Box>
                }
            </Box>
        </Box>
    )
}

export default JoinMeeting