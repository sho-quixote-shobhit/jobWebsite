import { Box, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, useToast, Text, Button, Center } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useChat } from '../providers/chatContext';

const SingleJobApplications = () => {
    const { jobId } = useParams()
    const toast = useToast()
    const {setselectedChat} = useChat()

    const [applications, setapplications] = useState([])

    useEffect(() => {
        setselectedChat('')
        const fetchApplications = async () => {
            await axios.get(`http://localhost:5000/job/${jobId}/applications`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                }
            }).then(res => {
                setapplications(res.data.applications)
                console.log(res.data.applications)
            }).catch(err => {
                toast({
                    title: err,
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                })
                return;
            })
        }
        fetchApplications()
    }, [jobId , toast])

    const daysAgo = (createdDate) => {
        const currentDate = new Date();
        const createdAtDate = new Date(createdDate);
        const timeDifference = currentDate.getTime() - createdAtDate.getTime();
        const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
        return daysDifference;
    }
    return (
        <Box w={{ base: "100%", md: "80%" }} m='auto auto' mt={5}>
            <Center><Text fontSize='3xl'>Applications</Text></Center>

            {applications[0] &&
                <Flex flexDir='column' alignItems='center' mb={5}>
                    <Text>{applications[0].job.profile.profile}</Text>
                    <Text>{applications[0].job.company}</Text>
                </Flex>}

            {applications &&
                <Box w={{ base: "90%", md: "80%" }} m='auto auto'>
                    <Tabs variant='soft-rounded' colorScheme='green' >
                        <TabList ml={4}>
                            <Tab borderRadius='20px' mr={1} py={1} px={3}>Pending</Tab>
                            <Tab borderRadius='20px' ml={1} py={1} px={3}>Accepted</Tab>
                        </TabList>

                    <TabPanels>
                            <TabPanel>
                                {applications.map((app) => {
                                    return (
                                        app.status === 'In Progress' && <Box p={5} my={5} border='2px solid #D3D3D3'
                                            color="black" key={app._id} borderRadius='10px'
                                            transition="border-color 0.3s ease, transform 0.3s ease"
                                            _hover={{
                                                borderColor: 'pink',
                                                transform: 'scale(1.01)', 
                                            }}
                                            >
                                            <Flex justifyContent='space-between'>
                                                <Text my={1} fontSize='125%' fontWeight='bold'>{app.student.name}</Text>
                                                <Text>{daysAgo(app.createdAt)} days ago</Text>
                                            </Flex>
                                            <Text my={1} fontSize='sm' >{app.student.email}</Text>
                                            <Text my={1}>In {app.job.company}</Text>
                                            <hr style={{ margin: '5px 0' }} />
                                            <Link to={`/${app._id}/view`}><Button colorScheme='pink' size='sm'>View</Button></Link>
                                        </Box>
                                    )
                                })}
                            </TabPanel>
                            <TabPanel>
                                {applications.map((app) => {
                                    return (
                                        app.status === 'accepted' && <Box p={5} my={5} border='1px solid #D3D3D3'
                                            color="black" key={app._id} borderRadius='10px'
                                            transition="border-color 0.3s ease, transform 0.3s ease"
                                            _hover={{
                                                borderColor: 'pink',
                                                transform: 'scale(1.01)', 
                                            }}
                                            >
                                            <Flex justifyContent='space-between'>
                                                <Text my={1} fontSize='125%' fontWeight='bold'>{app.student.name}</Text>
                                                <Text>{daysAgo(app.createdAt)} days ago</Text>
                                            </Flex>
                                            <Text my={1} fontSize='sm' >{app.student.email}</Text>
                                            <Text my={1}>In {app.job.company}</Text>
                                            <hr style={{ margin: '5px 0' }} />
                                            <Link to={`/${app._id}/view`}><Button colorScheme='pink' size='sm'>View</Button></Link>
                                        </Box>
                                    )
                                })}
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            }
        </Box>
    )
}

export default SingleJobApplications