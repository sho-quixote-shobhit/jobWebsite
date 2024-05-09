import React, { useEffect, useState } from 'react'
import { Box, Center, Flex, Heading, Text } from '@chakra-ui/react'
import axios from 'axios'
import { EmailIcon, TimeIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { Link } from 'react-router-dom'
import { useChat } from '../providers/chatContext';

const JobsApplied = () => {
    const [applications, setapplications] = useState()

    const {setselectedChat} = useChat()
    useEffect(() => {
        setselectedChat('')
        const fetchApplications = async () => {
            await axios.get('http://localhost:5000/job/getmyapplications', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                }
            }).then(res => {
                console.log(res.data)
                setapplications(res.data.applications)
            })
        }
        fetchApplications()
    }, [])

    const setbg = (status) => {
        if (status === 'In Progress') return "#ADD8E6"
        else if (status === 'accepted') return "#90EE90"
        else return "#FF474C"
    }

    const createdAt = (created) => {
        const date = new Date(created);

        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        return formattedDate
    }

    return (
        <Box w={{ base: "100%", md: "80%" }} m='auto auto'>
            <Box w={{ base: "90%", md: "80%" }} m='auto auto' >
                <Center>
                    <Heading my={5}>My Applications</Heading>
                </Center>
                {applications && applications.map(app => (
                    <Box key={app._id} border='2px solid #D3D3D3' p={5} borderRadius="5px" my={5}
                    transition="border-color 0.3s ease, transform 0.3s ease"
                    _hover={{
                        borderColor: 'pink',
                        transform: 'scale(1.01)', 
                    }}
                    >
                        <Text my={1} fontSize='xl' fontWeight='bold'>{app.job.company}</Text>
                        <Flex alignItems='center'>
                            <Text my={1}>{app.job.profile.profile}</Text>
                            <Link to = {`/jobs/${app.job.profile.profile}`} ><ExternalLinkIcon ml={1} /></Link>
                        </Flex>
                        <Text my={1} bg={setbg(app.status)} color='black' p={1} borderRadius='10px' display='inline-block' size="sm">{app.status}</Text>
                        <Box display='flex' justifyContent='space-between'>
                            <Text display='flex' alignItems='center' p={1}><EmailIcon mr={1} />{app.job.appliedBy.length} Applicants</Text>
                            <Text display='flex' alignItems='center' p={1}> <TimeIcon mr={1} /> Applied on {createdAt(app.createdAt)}</Text>
                            <Text></Text>
                        </Box>

                    </Box>
                ))}
            </Box>
        </Box>
    )
}

export default JobsApplied