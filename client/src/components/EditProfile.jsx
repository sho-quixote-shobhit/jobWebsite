import { Box, Button, Center, Flex, FormControl, FormLabel, Heading, Input, useToast, Image, Tooltip, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useUser } from '../providers/userContext';
import { SmallAddIcon, DeleteIcon, CloseIcon } from '@chakra-ui/icons'
import AddProfile from './AddProfile';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from 'axios';
import AddImage from './AddImage';
import AddResume from './AddResume';
import { Link, useNavigate } from 'react-router-dom';
import { useChat } from '../providers/chatContext';

const EditProfile = () => {

    const { user, setuser } = useUser();
    const {setselectedChat} = useChat()
    const [newname, setnewname] = useState('');
    const [newemail, setnewemail] = useState('')
    const [loading, setloading] = useState(false);
    const [skill, setskill] = useState('')

    const [imgloading, setimgloading] = useState(true)

    const toast = useToast();
    const navigate = useNavigate()

    useEffect(() => {
        setselectedChat('')
        const userInfo = JSON.parse(localStorage.getItem('user'));
        if (userInfo) {
            setuser(userInfo)
            setnewname(userInfo.name)
            setnewemail(userInfo.email)
        }
    }, [setuser])

    const handleAddSkill = async (e) => {
        e.preventDefault()
        if (!skill) {
            toast({
                title: 'Add a skill!!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            return;
        }
        await axios.put('http://localhost:5000/user/addskill', { skill }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => {
            setskill('')
            if (res.data.error) {
                toast({
                    title: res.data.error,
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                })
                return;
            }
            setuser(res.data.user)
            localStorage.setItem('user', JSON.stringify(res.data.user))
            toast({
                title: 'Skill was updated successfully!!',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
            return;
        })
    }

    const deleteSkill = async (skill) => {
        await axios.put('http://localhost:5000/user/removeskill', { skill }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => {
            setuser(res.data.user)
            localStorage.setItem('user', JSON.stringify(res.data.user))
        })
    }

    const handleDeleteSkill = async (skill) => {
        confirmAlert({
            message: `Are you sure to delete ${skill} as a Skill`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => { deleteSkill(skill) }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        if (!newname || !newemail) {
            toast({
                title: 'Enter all the fields!!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            return;
        }
        try {
            setloading(true)
            await axios.put('http://localhost:5000/user/updateprofile', { newname, newemail }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                }
            }).then(res => {
                if (res.data.error) {
                    setloading(false)
                    toast({
                        title: res.data.error,
                        status: 'warning',
                        duration: 2000,
                        isClosable: true,
                    })
                    return;
                }
                setuser(res.data.user)
                localStorage.setItem('user', JSON.stringify(res.data.user))
                setloading(false)
                toast({
                    title: 'Profile was updated successfully!!',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                })
                return;
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleView = (resume) => {
        console.log('hi')
        window.open(`http://localhost:5000/files/${resume}`, "_blank", "noreferrer")
    }

    const deleteresume = async (resume) => {
        try {
            await axios.put('http://localhost:5000/user/deleteresume', { resume }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                }
            }).then(res => {
                setuser(res.data.user)
                localStorage.setItem('user', JSON.stringify(res.data.user))
                toast({
                    title: 'Resume was deleted!!',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                })
                return;
            })
        } catch (error) {
            console.log(error)
            toast({
                title: error,
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            return;
        }
    }

    const handleDeleteResume = (resume) => {
        confirmAlert({
            message: `Are you sure to delete Resume!!`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => { deleteresume(resume) }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }

    const handleSkillChange = (event) => {
        const value = event.target.value;
        const regex = /^[a-zA-Z\s]*$/;
        if (regex.test(value)) {
            setskill(value);
        }
    };

    return (
        <>
            <Box
                bgGradient="linear(to-r, #000000, #333333)"
                p={8}
                m={0}
            >
                {user && <Box
                    w={{ base: '100%', sm: '100%', md: '90%', lg: '50%' }}
                    h={{ base: '70%', sm: '70%', md: '70%', lg: '70%' }}
                    color='white'
                    display='flex'
                    m="10px auto"
                    flexDirection={{ base: 'column', sm: 'column', md: 'row', lg: 'row' }}
                >
                    {imgloading && <Spinner />}

                    {/* profile pic */}

                    <AddImage
                        frontloading={setimgloading}
                    >
                        <Tooltip label='Edit'>
                            <Image
                                src={user.photo}
                                w='120px'
                                h='120px'
                                borderRadius='20px'
                                cursor='pointer'
                                _hover={{ filter: 'brightness(40%)' }}
                                onLoad={() => { setimgloading(false) }}
                            />
                        </Tooltip>
                    </AddImage>
                    <Box m={2} display='flex' flexDir='column' >
                        <Text fontSize='2xl'>{user.name}</Text>
                        {user.profession === 'Student' && user.profile && <Text>{user.profile.profile}</Text>}
                        {user.profession === 'Recruiter' && <Text>Recruiter</Text>}
                    </Box>
                </Box>
                }
            </Box>

            <Box position='relative'>
                <Box p={5} h='20px' bgGradient="linear(to-r, #000000, #333333)" position='absolute' left={0} right={0} bottom={0} top={0} ></Box>
                {user && <Flex
                    h={{ base: '70vh', sm: '70vh', md: '70vh', lg: '70vh' }}
                    justifyContent="center"
                    bg='white'
                >
                    <Flex
                        w={{ base: '100%', sm: '100%', md: '90%', lg: '50%' }}
                        flexDirection="column"
                        h={{ base: '90%', sm: '90%', md: '80%', lg: '80%' }}
                        p={12}
                        borderRadius={8}
                        boxShadow="5px 5px 5px 5px pink"
                        position='relative'
                        zIndex={1}
                        bg='white'
                    >
                        <Center><Heading mb={6}>Profile</Heading></Center>
                        <FormControl mb={4} display='flex' alignItems='center'>
                            <FormLabel m='auto 0' style={{ fontWeight: 'bold' }}>Name</FormLabel>
                            <Input ml={1} type="text" value={newname} onChange={(e) => setnewname(e.target.value)} size='sm' borderRadius='10px' />
                        </FormControl>
                        <FormControl mb={4} display='flex' alignItems='center'>
                            <FormLabel m='auto 0' style={{ fontWeight: 'bold' }}>Email</FormLabel>
                            <Input ml={1} type="text" value={newemail} onChange={(e) => setnewemail(e.target.value)} size='sm' borderRadius='10px' />
                        </FormControl>

                        {user.profession === 'Student' ? (<>

                            {/* resume */}

                            <FormControl mb={4} display='flex' alignItems='center'>
                                <FormLabel m='auto 0' style={{ fontWeight: 'bold' }}>Resume</FormLabel>
                                {user.resume === 'no' ? <>
                                    <AddResume>
                                        <Button
                                            w={5}
                                            h={5}
                                            bgColor='grey'
                                            ml={3}
                                        ><SmallAddIcon />
                                        </Button>
                                    </AddResume>
                                </> : <>
                                    <Box display='flex'>
                                        <Button mx={1} size='sm' onClick={(e) => { handleView(user.resume) }} colorScheme='pink'>View</Button>
                                        <AddResume>
                                            <Button mx={1} size='sm' colorScheme='blue'>Change</Button>
                                        </AddResume>
                                        <Button mx={1} size='sm' colorScheme='red' onClick={(e) => { handleDeleteResume(user.resume) }}><DeleteIcon /></Button>
                                    </Box>
                                </>}

                            </FormControl>

                            {/* job profile */}
                            <FormControl mb={4}>
                                <Box display='flex' alignItems='center'>
                                    <FormLabel m='auto 0' style={{ fontWeight: 'bold' }}>Your Job Profile</FormLabel>
                                    {!user.profile ? (<>
                                        <AddProfile>
                                            <Button
                                                w={5}
                                                h={5}
                                                bgColor='grey'
                                                ml={3}
                                            ><SmallAddIcon />
                                            </Button>
                                        </AddProfile>
                                    </>) : (<>
                                        <Box display='flex' alignItems='center' >
                                            <AddProfile>
                                                <Box><Button mx={1} size='sm' colorScheme='blue'>Change</Button></Box>
                                            </AddProfile>
                                        </Box>
                                    </>)}

                                </Box>
                            </FormControl>


                            {/* adding skills */}
                            <FormControl>
                                <FormLabel style={{ fontWeight: 'bold' }}>Add Skill</FormLabel>
                                <Box display='flex' alignItems='center'>
                                    <Input
                                        type='text'
                                        value={skill}
                                        onChange={(e) => { handleSkillChange(e) }}
                                        size='sm'
                                        borderRadius='10px'
                                        placeholder='Eg : ReactJs'
                                    />
                                    <SmallAddIcon cursor='pointer' ml={3} bg='grey' w={7} h={7} borderRadius='10px' onClick={handleAddSkill} />
                                </Box>
                            </FormControl>

                            {/* showing skills */}
                            <Box mt={1} w="100%" display='flex' flexWrap='wrap'>
                                {user.skills.map((skill) => {
                                    return (
                                        <Box
                                            px={2}
                                            py={1}
                                            borderRadius='lg'
                                            m={1}
                                            mb={2}
                                            fontSize={12}
                                            backgroundColor='black'
                                            color='white'
                                            cursor='pointer'
                                            onClick={() => { handleDeleteSkill(skill) }}
                                        >
                                            {skill}
                                            <CloseIcon pl={1} />
                                        </Box>
                                    )
                                })}
                            </Box>
                        </>) : (<></>)}

                        {user.profession === 'Recruiter' ? (<Flex alignItems='center' my={2}>
                            <Text fontWeight='bold'>Add Job</Text>
                            <SmallAddIcon cursor='pointer' w={5} h={5} ml={2} bg='grey' borderRadius='20px' color='black' onClick={() => { navigate('/addjob') }} />
                            {user.jobs.length === 0 ? (<></>) : (<Link to='/jobsoffered'><Button size='sm' ml={2} colorScheme='blue'>View Jobs Offered</Button></Link>)}
                        </Flex>) : (<></>)}


                        <Box><Button mt={2} colorScheme="pink" isLoading={loading} onClick={(e) => { handleUpdate(e) }} loadingText="Updating">Update Profile</Button></Box>
                    </Flex>
                </Flex>}
            </Box>
        </>
    )
}

export default EditProfile