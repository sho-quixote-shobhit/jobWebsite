import React, { useState } from 'react'
import { useUser } from '../../providers/userContext'
import { Box } from '@chakra-ui/react'
import MyChats from './MyChats'
import ChatBox from './ChatBox'


const ChatPage = () => {
    const { user } = useUser()
    const [fetchAgain, setfetchAgain] = useState(false)

    return (
        <Box style={{ width: "100%" }}>
            <Box
                display={'flex'}
                justifyContent={'space-between'}
                w={'100%'}
                h={'91.5vh'}
                p={'10px'}
            >
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} />}
            </Box>
        </Box>
    )
}

export default ChatPage