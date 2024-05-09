import { Box , Text} from '@chakra-ui/react'
import React from 'react'

const ProfileListItem = ({ profile ,handleFunction }) => {
    return (
        <Box
            onClick={handleFunction}
            cursor='pointer'
            bg="#E8E8E8"
            _hover={{
                background: "#38B2AC",
                color: 'white'
            }}
            w='100%'
            display='flex'
            alignItems='center'
            color='black'
            px={3}
            py={1}
            mb={2}
            borderRadius='lg'
        >
            <Box>
                <Text>{profile.profile}</Text>
            </Box>
        </Box>
    )
}

export default ProfileListItem