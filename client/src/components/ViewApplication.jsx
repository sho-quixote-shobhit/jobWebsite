import { Box, Flex, Text, Image, Button, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { StarIcon } from '@chakra-ui/icons'
import { confirmAlert } from 'react-confirm-alert';
import {CheckIcon , ChatIcon} from '@chakra-ui/icons'
import { useChat } from '../providers/chatContext';

const ViewApplication = () => {
    const { appId } = useParams();
    const [app, setapp] = useState();
    const [loading, setloading] = useState(false)
    const [accloading, setaccloading] = useState(false)
    const [resumeAnalyse, setresumeanalyse] = useState('')
    const toast = useToast();
    const navigate = useNavigate();

    const {setselectedChat} = useChat()

    const daysAgo = (createdDate) => {
        const currentDate = new Date();
        const createdAtDate = new Date(createdDate);
        const timeDifference = currentDate.getTime() - createdAtDate.getTime();
        const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
        return daysDifference;
    }


    useEffect(() => {
        const fetchApp = async () => {
            await axios.get(`http://localhost:5000/job/getapp/${appId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                }
            }).then(res => {
                setapp(res.data.application)
            })
        }
        fetchApp()
    }, [appId])

    const handleAnaylse = async (appId) => {
        if (!appId) {
            toast({
                title: 'User may have deleted the resume!!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            return;
        }
        setloading(true);
        await axios.get(`http://localhost:5000/job/analyse/${appId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => {
            if (res.data.error) {
                toast({
                    title: res.data.error,
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                })
                return;
            }
            setresumeanalyse(res.data.result)
            setloading(false);
        })
    }

    const handleAccept = async (appId) => {
        if (!appId) {
            toast({
                title: 'No Application!!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            return;
        }
        setaccloading(true)
        await axios.put('http://localhost:5000/job/accept', { appId }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => {
            if (res.data.error) {
                toast({
                    title: res.data.error,
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                })
                return;
            }
            toast({
                title: 'Application Accepted!!',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
            setaccloading(false);
            navigate('/')
        }).catch(err => {
            toast({
                title: err,
                status: 'danger',
                duration: 2000,
                isClosable: true,
            })
            return;
        })
    }

    const handleConfirmAccept = (appId) => {
        confirmAlert({
            message: `Are you sure to accept the application!!`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        handleAccept(appId)
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }

    const handleReject = async (appId) => {
        if (!appId) {
            toast({
                title: 'No Application!!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            return;
        }
        setaccloading(true)
        await axios.put('http://localhost:5000/job/reject', { appId }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => {
            if (res.data.error) {
                toast({
                    title: res.data.error,
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                })
                return;
            }
            toast({
                title: 'Application Rejected!!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            setaccloading(false);
            navigate('/')
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

    const handleConfirmReject = (appId) => {
        confirmAlert({
            message: `Are you sure to reject the application!!`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        handleReject(appId)
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }

    const handleView = (resume) => {
        if (resume === 'no') {
            toast({
                title: 'User may have deleted the resume!!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            return;
        }
        console.log('hi')
        window.open(`http://localhost:5000/files/${resume}`, "_blank", "noreferrer")
    }

    const createChat = async(userId) => {
        if(!userId){
            toast({
                title: 'No student!!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            return;
        }
        try {
            await axios.post('http://localhost:5000/chat' , {userId} , {headers : {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + localStorage.getItem('jwt')
            }}).then(res => {
                setselectedChat(res.data)
                navigate('/chats')
            }).catch(err => {
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Box w={{ base: "100%", md: "80%" }} m='auto auto' mt={5}>
            {app &&
                <Box w={{ base: "98%", md: "80%" }} m='auto auto' border='2px solid #D3D3D3' p={4} borderRadius='10px'>

                    {/* student name */}
                    <Flex justifyContent='space-between' alignItems='center'>
                        <Box>
                            <Text>Applied By</Text>
                            <Text fontSize='3xl'>{app.student.name}</Text>
                            <Text fontSize='sm'>{daysAgo(app.createdAt)} days ago</Text>
                        </Box>
                        <Image
                            src={app.student.photo}
                            w='100px'
                            h='100px'
                            borderRadius='50%'
                        />
                    </Flex>

                    <hr style={{ margin: '5px 0' }} />

                    {/* job description */}
                    <Box mt={3}>
                        <Text fontWeight='bold'>Job Description</Text>
                        <Text fontSize='sm'>For {app.job.company}</Text>
                        <Text fontSize='sm'>Profile {app.job.profile.profile}</Text>
                        <Text fontWeight='bold'>Skills Required</Text>
                        <Flex flexDir='column'>
                            {app.job.skills.map(skill => {
                                return (
                                    <Flex alignItems='center' key={skill}>
                                        <StarIcon w={2} h={2} />
                                        <Text fontSize='sm' key={skill}>{skill}</Text>
                                    </Flex>
                                )
                            })}
                        </Flex>
                    </Box>

                    <hr style={{ margin: '5px 0' }} />

                    {/* student skill */}
                    <Box mt={3}>
                        <Text fontWeight='bold'>Student Skills</Text>
                        <Flex flexDir='column'>
                            {app.student.skills.map(skill => {
                                return (
                                    <Flex alignItems='center' key={skill}>
                                        <StarIcon w={2} h={2} />
                                        <Text fontSize='sm' key={skill}>{skill}</Text>
                                    </Flex>
                                )
                            })}
                        </Flex>
                        <Text fontWeight='bold' mt={3} mb={1}>Resume</Text>
                        <Flex>
                            <Button size='sm' colorScheme='blue' onClick={() => { handleView(app.student.resume) }}>View</Button>
                            <Button loadingText='Analyzing' size='sm' ml={2} isLoading={loading} colorScheme='pink' onClick={() => { handleAnaylse(app._id) }}>Analyse</Button>
                        </Flex>
                    </Box>

                    <hr style={{ margin: '5px 0' }} />
                    {resumeAnalyse && <Box my={3}>
                        <Text fontWeight='bold'>Match : {resumeAnalyse.match}</Text>
                        <Text>Summary : {resumeAnalyse.summary}</Text>
                        <hr style={{ margin: '5px 0' }} />
                    </Box>}


                    <Box mt={4}>

                        {app.status === 'In Progress' && <Flex flexDir='column'>
                            <Text my={2}>Is {app.student.name} suited for the Job?</Text>
                            <Flex>
                                <Button loadingText='Accepting' isLoading={accloading} size='sm' colorScheme='green' onClick={(e) => { handleConfirmAccept(app._id) }}>Accept</Button>
                                <Button size='sm' colorScheme='red' ml={2} onClick={(e) => { handleConfirmReject(app._id) }}>Reject</Button>
                            </Flex>
                        </Flex>}

                        {app.status === 'accepted' && <Flex alignItems='center'>
                                <CheckIcon w={7} h={7} borderRadius='50%' />
                                <ChatIcon ml={4} w={7} h={7} cursor='pointer' onClick={()=>{createChat(app.student._id)}} />
                            </Flex>}
                    </Box>
                </Box>
            }
        </Box>
    )
}

export default ViewApplication