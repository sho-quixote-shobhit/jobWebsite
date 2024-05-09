import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    Box,
    Text,
    Button,
    useColorModeValue,
    Heading,
    Center,
    Input,
    InputGroup,
    InputRightElement,
    IconButton,
    Flex,
    Tooltip,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    useToast
} from '@chakra-ui/react';
import { useUser } from '../providers/userContext';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalLinkIcon, Search2Icon } from '@chakra-ui/icons'
import ApplyModal from './ApplyModal';
import { useChat } from '../providers/chatContext';

const HomePage = () => {

    const { user } = useUser();
    const { setselectedChat } = useChat()
    const formBackground = useColorModeValue('gray.100', 'gray.700');
    const [data, setdata] = useState([]);
    const [datarec, setdatarec] = useState([])
    const [search, setsearch] = useState('')
    const navigate = useNavigate()
    const [recommended,setrecommended] = useState([])
    const toast = useToast()

    useEffect(() => {
        setselectedChat('')
        const fetchData = async () => {

            localStorage.getItem('jwt') && await axios.get('http://localhost:5000/job/homepage', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                }
            }).then(res => {
                setdata(res.data.jobs)
                console.log(res.data.applications)
                setdatarec(res.data.applications)
            })

        }
        fetchData();
    }, [])

    const [isExpanded, setIsExpanded] = useState(false);
    const toggleSearch = () => {
        setIsExpanded(!isExpanded);
    };

    const handleSearch = () => {
        navigate(`/jobs/${search}`)
    }

    const daysAgo = (createdDate) => {
        const currentDate = new Date();
        const createdAtDate = new Date(createdDate);
        const timeDifference = currentDate.getTime() - createdAtDate.getTime();
        const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
        return daysDifference;
    }

    const handleRecommended = async() => {
        if(user.skills.length === 0){
            toast({
                title: 'Add skills to your profile!!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            return;
        }
        try {
            await axios.get('http://localhost:5000/job/recommended' , {headers : {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + localStorage.getItem('jwt')
            }}).then(res => {
                setrecommended(res.data.jobs)
            })
        } catch (error) {
            console.log(error)
            toast({
                title: error.message,
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            return;
        }
    }

    return (
        <Box w={{ base: "100%", md: "80%" }} m='auto auto'>
            <Center><Heading mt={3}>Meowदिहाड़ी</Heading></Center>
            {/* complete your profile */}
            <Box w={{ base: "90%", md: "80%" }} m='auto auto' bg={formBackground} borderRadius="20px">
                {user && user.profession === 'Student' && (user.skills.length === 0 || user.resume === 'no') ? (
                    <Box display='flex' flexDir='column' justifyContent='center' alignItems='center' mt={5} p={10}>
                        <Text my={2} fontSize='xl'>Complete Your Profile</Text>
                        <Text my={2}>
                            Add your resume or skills to receive tailored recommendations suited for your profile. Our system will analyze your skills and experiences to provide you with the best possible matches.
                        </Text>
                        <Link to="/editprofile"><Button my={2} colorScheme='twitter'>Complete Profile</Button></Link>
                    </Box>
                ) : (
                    user && user.profession === 'Recruiter' && user.jobs.length === 0 ? (<Box display='flex' flexDir='column' justifyContent='center' alignItems='center' mt={5} p={10}>
                        <Text my={2} fontSize='xl'>What are you hiring for?</Text>
                        <Text my={2}>
                            Add the jobs with skills you needed in empoyees to find the best workers for you company!!
                        </Text>
                        <Link to="/addjob"><Button my={2} colorScheme='twitter'>Create Jobs</Button></Link>
                    </Box>) : (<></>)
                )}
            </Box>

            {user && user.profession === 'Student' ? (
                //logged in as a student
                <Box w={{ base: "90%", md: "80%" }} m='auto auto'>
                    

                    {/* search */}
                    <Box display='flex' py={2} ml={4} onMouseEnter={toggleSearch} onMouseLeave={toggleSearch}>
                        {!isExpanded ? (
                            <IconButton
                                aria-label='Search'
                                icon={<Search2Icon />}
                                cursor='pointer'
                                borderRadius='50%'
                            />
                        ) : (
                            <InputGroup as='form' onSubmit={handleSearch} >
                                <Input
                                    placeholder='Search...'
                                    value={search}
                                    onChange={(e) => { setsearch(e.target.value) }}
                                    p={4}
                                    borderRadius='10px'
                                />
                                <InputRightElement>
                                    <Button type='submit' borderRadius="50%"><Search2Icon /></Button>
                                </InputRightElement>
                            </InputGroup>
                        )}
                    </Box>

                    {/* jobs for student */}

                    <Tabs
                        variant='soft-rounded' colorScheme='green'
                        mt={3}
                    >
                        <TabList ml={4}>
                            <Tab>All Jobs</Tab>
                            <Tab onClick={handleRecommended}>Recommended Jobs</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                {data && data.map((job) => {
                                    let matchedSkillsCount = 0;
                                    return (
                                        !job.appliedBy.includes(user._id) && <Box p={5} my={5} border='2px solid #D3D3D3'
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
                                                job={job}
                                                setdata={setdata}
                                            >
                                                <Button mt={1} size='sm' colorScheme='pink' isDisabled={job.appliedBy.includes(user._id)}>Apply</Button>
                                            </ApplyModal>
                                        </Box>
                                    );
                                })}
                            </TabPanel>
                            <TabPanel>
                            {recommended && recommended.map((job) => {
                                    return (
                                        !job.appliedBy.includes(user._id) && <Box p={5} my={5} border='2px solid #D3D3D3'
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
                                            <hr style={{ margin: '4px 0' }} />
                                            <ApplyModal
                                                job={job}
                                                setdata={setdata}
                                            >
                                                <Button mt={1} size='sm' colorScheme='pink' isDisabled={job.appliedBy.includes(user._id)}>Apply</Button>
                                            </ApplyModal>
                                        </Box>
                                    );
                                })}
                            </TabPanel>
                        </TabPanels>
                    </Tabs>

                </Box>
            ) : (
                //logged in  as a recruiter
                user && user.profession === 'Recruiter' ? (
                    <Box w={{ base: "90%", md: "80%" }} m='auto auto'>
                        <Center><Text fontSize='3xl' my={4}>Pending Applications</Text></Center>

                        {/* showing all applications that came to this recruiter */}
                        {datarec && datarec.map((app) => {
                            return (
                                app.status === 'In Progress' && <Box p={5} my={5} border='2px solid #D3D3D3'
                                    color="black" key={app._id} borderRadius='10px'
                                    transition="border-color 0.3s ease, transform 0.3s ease"
                                    _hover={{
                                        borderColor: 'pink',
                                        transform: 'scale(1.01)',
                                    }}>
                                    <Flex justifyContent='space-between'>
                                        <Text my={1} fontSize='125%' fontWeight='bold'>{app.student.name}</Text>
                                        <Text>{daysAgo(app.createdAt)} days ago</Text>
                                    </Flex>
                                    <Text my={1} fontSize='sm' >{app.student.email}</Text>
                                    <Flex my={1} alignItems='center'>
                                        <Text>For </Text>
                                        <Text color='teal'>&nbsp; {app.job.profile.profile}</Text>
                                        <Tooltip label='view applications'>
                                            <Link to={`/${app.job._id}/applications`}><ExternalLinkIcon ml={1} /></Link>
                                        </Tooltip>
                                    </Flex>
                                    <Text my={1}>In {app.job.company}</Text>
                                    <hr style={{ margin: '5px 0' }} />
                                    <Link to={`/${app._id}/view`}><Button colorScheme='pink' size='sm'>View</Button></Link>
                                </Box>
                            )
                        })}
                    </Box>
                ) : (
                    //not logged in
                    <Box w={{base : '90%' , md : '80%'}}  m='auto auto'>
                        <Box display='flex' h='80vh' justifyContent='center' alignItems='center' m='auto auto' flexDir='column'>
                            <Text fontSize='3xl'>Join Us</Text>
                            <Link to="/signup"><Button colorScheme='pink'>SignUp</Button></Link>
                        </Box>
                    </Box>
                )
            )}

        </Box>
    )
}

export default HomePage