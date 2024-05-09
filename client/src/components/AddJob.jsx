import React, { useState } from 'react'
import {
    Flex,
    Heading,
    Input,
    Button,
    Center,
    Box,
    useToast,
    FormControl,
    FormLabel,
    Textarea,
} from '@chakra-ui/react';
import { CloseIcon, SmallAddIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useUser } from '../providers/userContext';
import { useNavigate } from 'react-router-dom';
import AddProfile from './AddProfile';

const AddJob = () => {
    const [company, setcompany] = useState('')
    const [profile, setprofile] = useState()
    const [seats, setseats] = useState(0)
    const [selectedskills, setselectedskills] = useState([]);
    const [skill, setskill] = useState('')
    const [jobloading, setjobloading] = useState()
    const [description , setdescription] = useState('')

    const navigate = useNavigate()
    const toast = useToast();
    const { setuser } = useUser()


    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!profile || !company || selectedskills.length === 0) {
            toast({
                title: 'Complete the data',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            return;
        }
        if (seats === 0) {
            toast({
                title: 'Vacancies must be greater than 0',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            return;
        }
        setjobloading(true)
        await axios.post('http://localhost:5000/user/addjob', { company, seats, skills: selectedskills, profile , description }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => {
            if (res.data.error) {
                setjobloading(false)
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
            setjobloading(false)
            toast({
                title: 'Job was updated successfully!!',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
            navigate('/')
            return;
        })
    }

    const handleDeleteSkill = (skilltodelete) => {
        setselectedskills(selectedskills.filter(skill => skill !== skilltodelete))
    }

    const handleSkillChange = (event) => {
        const value = event.target.value;
        const regex = /^[a-zA-Z\s]*$/;
        if (regex.test(value)) {
            setskill(value);
        }
    };

    const handleAddSkill = () => {
        if(!skill){
            toast({
                title: 'Skill empty!!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            return;
        }
        if(selectedskills.includes(skill)){
            toast({
                title: 'Skill already added!!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            return;
        }
        setselectedskills([...selectedskills , skill])
        setskill('')
    }

    return (
        <>
            <Flex mt={10} alignItems="center" justifyContent="center">
                <Flex
                    as="form"
                    w={{ base: '90vw', sm: '75vw', md: '70vw', lg: '35vw' }}
                    flexDirection="column"
                    p={12}
                    borderRadius={8}
                    boxShadow="5px 5px 5px 5px pink"
                    onSubmit={handleSubmit}
                    color="black"
                >
                    <Center><Heading mb={6}>Create New Job</Heading></Center>

                    {/* company */}
                    <FormControl>
                        <FormLabel fontWeight='bold'>
                            Company's Name
                        </FormLabel>
                        <Input
                            type='text'
                            my={1}
                            onChange={(e) => setcompany(e.target.value)}
                            size='sm'
                            borderRadius='10px'
                            border='1px solid black'
                            placeholder='Google'
                        />
                    </FormControl>

                    {/* Job Profile */}
                    <FormControl mb={4}>
                        <Box mt={1} display='flex' alignItems='center'>
                            <FormLabel m='auto 0' style={{ fontWeight: 'bold' }}>Job Profile</FormLabel>
                            {profile ? <Box ml={1} display='flex' alignItems='center' >
                                <Box bg='black' color='white' borderRadius='10px' p={1} >{profile.profile}</Box>
                                <AddProfile
                                    setprofile={setprofile}
                                >
                                    <Box><Button mx={1} size='sm' colorScheme='blue'>Change</Button></Box>
                                </AddProfile>
                            </Box> : (<AddProfile
                                setprofile={setprofile}
                            >
                                <Button
                                    w={5}
                                    h={5}
                                    bgColor='grey'
                                    ml={3}
                                ><SmallAddIcon />
                                </Button>
                            </AddProfile>)}

                        </Box>
                    </FormControl>

                    {/* total seats */}
                    <FormControl>
                        <FormLabel fontWeight='bold'>
                            Total Vaccancies
                        </FormLabel>
                        <Input
                            type='number'
                            my={1}
                            onChange={(e) => setseats(e.target.value)}
                            size='sm'
                            borderRadius='10px'
                            border='1px solid black'
                        />
                    </FormControl>
                            
                    {/* job description */}

                    <FormControl>
                        <FormLabel fontWeight='bold'>
                            Job Descripton
                        </FormLabel>
                        <Textarea 
                            type='text'
                            my={1}
                            onChange={(e) => setdescription(e.target.value)}
                            size='sm'
                            borderRadius='10px'
                            border='1px solid black'
                            rows={3}
                        />
                    </FormControl>

                    {/* skills */}
                    <FormControl>
                        <FormLabel style={{ fontWeight: 'bold' }}>Add Skill</FormLabel>
                        <Box display='flex' alignItems='center'>
                            <Input
                                type='text'
                                value={skill}
                                onChange={(e) => {handleSkillChange(e)}}
                                size='sm'
                                borderRadius='10px'
                                placeholder='Eg : ReactJs'
                                border='1px solid black'
                            />
                            <SmallAddIcon cursor='pointer' ml={3} bg='grey' w={7} h={7} borderRadius='10px' onClick={handleAddSkill} />
                        </Box>
                    </FormControl>

                    {/* showing added skills */}

                    <Box w="100%" display='flex' flexWrap='wrap'>
                        {selectedskills.map((skill) => {
                            return (
                                <Box
                                    key={skill}
                                    px={2}
                                    py={1}
                                    borderRadius='lg'
                                    m={1}
                                    mb={2}
                                    fontSize={12}
                                    backgroundColor='black'
                                    color='white'
                                    cursor='pointer'
                                    onClick={() => { }}
                                >
                                    {skill}
                                    <CloseIcon pl={1} onClick={() => { handleDeleteSkill(skill) }} />
                                </Box>
                            )
                        })}
                    </Box>
                    <Box><Button mt={1} colorScheme='blue'  isLoading={jobloading} onClick={handleSubmit} loadingText="Adding" type='submit'>Add</Button></Box>
                </Flex>
            </Flex>
        </>
    )
}

export default AddJob