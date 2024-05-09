import { Box, Button, Center, Flex, Heading, Spinner, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../providers/chatContext';

const JobsOffered = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setloading] = useState(false)
    const {setselectedChat} = useChat()
    const navigate = useNavigate()

    useEffect(() => {
        setselectedChat('')
        const fetchJobs = async () => {
            try {
                setloading(true)
                const response = await axios.get('http://localhost:5000/user/jobsoffered', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                    }
                });
                setJobs(response.data);
                setloading(false)
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        }
        fetchJobs();
    }, []);


    return (
        <Box  w={{ base: "100%", md: "80%" }} m='auto auto' mt={5}>
            <Box
                display='flex'
                flexDirection='column'
            >
                <Center>{loading && <Spinner />}</Center>
                <Center><Heading my={4}>Jobs Offered</Heading></Center>
                {jobs.map((job) => (
                    <Box key={job._id} p={5} m='auto auto' my={5} w={{ base: "98%", md: "80%" }}  border='2px solid #D3D3D3' borderRadius='10px'
                    transition="border-color 0.3s ease, transform 0.3s ease"
                    _hover={{
                        borderColor: 'pink',
                        transform: 'scale(1.01)', 
                    }}
                    >
                        <Flex
                            justifyContent='space-between'
                        >
                            <Text my={1} fontSize='125%' fontWeight='bold'>{job.profile.profile}</Text>
                        </Flex>

                        <Text my={1} as='i' >{job.company}</Text>
                        <Text my={1} >Vacancy remaining : {job.seats}</Text>
                        <Box display='flex' alignItems='center'>
                            <Heading size="sm">Skills : </Heading>
                            {job.skills.map((skill) => (
                                <Text key={skill} size='sm' mx={1}>{skill}</Text>
                            ))}
                        </Box>
                        <Button mt={2} size='sm' colorScheme='pink' mr={1} onClick={()=>{navigate(`/${job._id}/applications`)}}>View Applications</Button>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export default JobsOffered;
