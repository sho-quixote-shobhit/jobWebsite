import React from 'react'
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast, Text, Box } from '@chakra-ui/react'
import { StarIcon } from '@chakra-ui/icons'
import axios from 'axios'
import { useUser } from '../providers/userContext'
import { Link, useNavigate } from 'react-router-dom'

const ApplyModal = ({ children, job, setdata}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { user } = useUser();

    const toast = useToast()
    const naviagte = useNavigate()

    const handleApply = async () => {
        if (!job) {
            toast({
                title: 'No job mentioned!!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            return;
        }
        try {
            if (user && (user.skills.length === 0 || user.resume === 'no')) {
                toast({
                    title: 'Complete your profile!!',
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                })
                return;
            }
            const jobId = job._id
            const recId = job.recruiter._id
            await axios.post('http://localhost:5000/job/applyjob', { jobId, recId }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                }
            }).then(res => {
                setdata(res.data)
                toast({
                    title: 'Applied Successfully',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                })
                onClose();
                naviagte('/')
                window.location.reload('/')
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal closeOnOverlayClick={false} isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize='2xl'>Apply for the job!!</ModalHeader>
                    <ModalCloseButton />
                    <hr />
                    <ModalBody>
                        <Flex flexDir='column'>
                            <Box my={2}>
                                <Text fontSize='xl' mb={2} fontWeight='bold'>Your Profile</Text>
                                <Flex alignItems='center' >
                                    {user && user.profile && user.profile.profile}
                                    {/* <Tooltip label='edit'><Link to='/editprofile'><EditIcon cursor='pointer' ml={3} /></Link></Tooltip> */}
                                </Flex>
                            </Box>
                            <Box my={2}>
                                <Text fontSize='xl' mb={2} fontWeight='bold'>Resume</Text>
                                <Flex alignItems='center' >
                                    {user && user.resume}
                                    {/* <Tooltip label='edit'><Link to='/editprofile'><EditIcon cursor='pointer' ml={3} /></Link></Tooltip> */}
                                </Flex>
                            </Box>
                            <Box my={2}>
                                <Text fontSize='xl' mb={2} fontWeight='bold'>Skills</Text>
                                <Flex alignItems='center' >
                                    {user && user.skills.map((skill) => {
                                        return (
                                            <Flex alignItems='center'>
                                                <StarIcon w={2} h={2} />
                                                <Text fontSize='sm' key={skill}>{skill} &nbsp;</Text>
                                            </Flex>
                                        )
                                    })}
                                    {/* <Tooltip label='edit'><Link to='/editprofile'><EditIcon cursor='pointer' ml={3} /></Link></Tooltip> */}
                                </Flex>
                            </Box>
                        </Flex>
                    </ModalBody>
                    <hr />
                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleApply} >Apply</Button>
                        <Link to="/editprofile"><Button colorScheme='cyan' color='black' ml={2}>Edit</Button></Link>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ApplyModal