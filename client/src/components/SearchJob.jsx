import { Box, Button, Center, Flex, Text , Tooltip } from '@chakra-ui/react'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useUser } from '../providers/userContext';
import {ViewIcon} from '@chakra-ui/icons'
import ApplyModal from './ApplyModal';

const SearchJob = () => {

    const { jobTitle } = useParams();
    const formattedTittle = jobTitle.replace(/%20/g, " ");
    const { user } = useUser()
    const [data, setdata] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://localhost:5000/job/searchjob/${jobTitle}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                }
            }).then(res => {
                if (res.data.error) {
                    console.log(res.data.error)
                }
                setdata(res.data.jobs)
            })
        }
        fetchData()
    }, [jobTitle])

    return (
        <Box w={{ base: "100%", md: "80%" }} m='auto auto'>
            <Flex justifyContent='center' flexDir='column' alignItems='center' mt={4}>
                <Text fontSize='3xl'>Related Jobs</Text>
                <Flex>
                    <Text>Search : </Text>
                    <Center><Text>&nbsp;{formattedTittle}</Text></Center>
                </Flex>
            </Flex>
            <Box w={{ base: "90%", md: "80%" }} m='auto auto'>
                {data && data.map((job) => {
                    let matchedSkillsCount = 0;
                    return (
                        <Box p={5} my={5} border='2px solid #D3D3D3'
                            color="black" key={job._id} borderRadius='10px'
                            
                            transition="border-color 0.3s ease, transform 0.3s ease"
                            _hover={{
                                borderColor: 'pink',
                                transform: 'scale(1.01)', 
                            }}
                            >
                            <Text fontSize='125%' fontWeight='bold'>{job.profile.profile}</Text>
                            <Text mt={1} as='i'>{job.company}</Text>
                            <Text mt={1}>Vacancy remaining: {job.seats}</Text>
                            <Box display='flex' alignItems='center'>
                                {job.skills.map((jobSkill) => {
                                    if (user.skills.some(userSkill => userSkill === jobSkill)) {
                                        matchedSkillsCount++;
                                    }
                                    return null;
                                })}
                            </Box>
                            <Text mt={1} size='sm' color={matchedSkillsCount === 0 ? 'red' : 'green'}>{matchedSkillsCount} skill matches your profile.</Text>
                            <hr style={{ margin: '4px 0' }} />
                            <ApplyModal
                                job = {job}
                            >
                                <Button mt={1} size='sm' colorScheme='pink' isDisabled={job.appliedBy.includes(user._id)}>{job.appliedBy.includes(user._id) ? 'Applied' : 'Apply'}</Button>
                            </ApplyModal>
                            {job.appliedBy.includes(user._id) && <Tooltip label = 'view application'><Link to="/applications"><ViewIcon ml={3} w={7} h={7} /></Link></Tooltip>}
                        </Box>
                    );
                })}
                {data.length === 0 && <Box display='flex' justifyContent='center' alignItems='center' mt={5} flexDir='column'>  
                    <Text fontSize='xl'>No Jobs Available</Text>
                    <Link to="/"><Button colorScheme='pink'>Go Back</Button></Link>
                </Box>}
            </Box>
        </Box>
    )
}

export default SearchJob