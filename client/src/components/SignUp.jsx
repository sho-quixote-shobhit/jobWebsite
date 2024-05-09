import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../providers/userContext';
import {
    Flex,
    Heading,
    Input,
    Button,
    useToast,
    FormControl,
    FormLabel,
    Select,
    Box,
    Center,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const SignUp = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const { setuser } = useUser();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profession, setProfession] = useState('Student');
    const [loading, setloading] = useState(false);
    const [showpass, setshowpass] = useState(false);
    const [showconfirmpass, setshowconfirmpass] = useState(false);

    const handleshow = () => {
        if (showpass) {
            setshowpass(false);
        } else setshowpass(true);
    }

    const handleconfirmshow = () => {
        if (showconfirmpass) {
            setshowconfirmpass(false);
        } else setshowconfirmpass(true);
    }

    const handleSignUp = async () => {
        /* eslint-disable */
        if (!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)) {
            toast({
                title: 'Enter a Valid Email!!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            return;
        }
        if (password.length < 8) {
            toast({
                title: 'Password must be 8 characters',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            return;
        }
        if (password !== confirmPassword) {
            toast({
                title: 'Passwords do not match!!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            return;
        }

        if (!password || !name || !email || !confirmPassword) {
            toast({
                title: 'Data Incomplete!!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            return;
        }
        setloading(true)
        await axios.post('http://localhost:5000/auth/signup', { name, email, password, profession }, { withCredentials: true }).then(res => {
            if (res.data.error) {
                toast({
                    title: res.data.error,
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                })
                setloading(false)
                return;
            }
            toast({
                title: 'SignUp Successfull',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
            setloading(false)
            setuser(res.data.user)
            localStorage.setItem('jwt', (res.data.token))
            localStorage.setItem('user', JSON.stringify(res.data.user))
            navigate('/')
        }).catch(err => {
            console.log(err)
        })
    }

        const handleSubmit = (e) => {
        e.preventDefault(); 
        handleSignUp();
    };

    return (
        <Flex
            mt={10}
            h={{ base: '70%', sm: '80%', md: '70%', lg: '70vh' }}
            alignItems="center"
            justifyContent="center"
        >
            <Flex
                as='form'
                w={{ base: '90%', sm: '80%', md: '70%', lg: '35%' }}
                flexDirection="column"
                p={12}
                borderRadius={8}
                boxShadow="5px 5px 5px 5px pink"
                onSubmit={handleSubmit}
            >
                <Center><Heading mb={6}>Sign Up</Heading></Center>
                <FormControl id="name" isRequired mb={4}>
                    <FormLabel style={{ fontWeight: 'bold' }}>Name</FormLabel>
                    <Flex>
                        <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </Flex>
                </FormControl>
                <FormControl id="email" isRequired mb={4}>
                    <FormLabel style={{ fontWeight: 'bold' }}>Email</FormLabel>
                    <Flex>
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Flex>
                </FormControl>
                <FormControl id="password" isRequired mb={4}>
                    <FormLabel style={{ fontWeight: 'bold' }}>Password</FormLabel>
                    <Box position="relative">
                        <Input type={showpass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
                        <Box position="absolute" right="10px" top="50%" transform="translateY(-50%)" cursor="pointer">
                            {showpass ? <ViewOffIcon onClick={handleshow} /> : <ViewIcon onClick={handleshow} />}
                        </Box>
                    </Box>
                </FormControl>
                <FormControl id="confirmPassword" isRequired mb={4}>
                    <FormLabel style={{ fontWeight: 'bold' }}>Confirm Password</FormLabel>
                    <Box position="relative">
                        <Input type={showconfirmpass ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <Box position="absolute" right="10px" top="50%" transform="translateY(-50%)" cursor="pointer">
                            {showconfirmpass ? <ViewOffIcon onClick={handleconfirmshow} /> : <ViewIcon onClick={handleconfirmshow} />}
                        </Box>
                    </Box>
                </FormControl>
                <FormControl id="profession" isRequired mb={4}>
                    <FormLabel style={{ fontWeight: 'bold' }}>Profession</FormLabel>
                    <Select value={profession} onChange={(e) => setProfession(e.target.value)}>
                        <option value="Student">Student</option>
                        <option value="Recruiter">Recruiter</option>
                    </Select>
                </FormControl>
                <Box><Button colorScheme="pink" isLoading={loading} loadingText="Signing Up" type='submit'>SignUp</Button></Box>
            </Flex>
        </Flex>
    );
};

export default SignUp;
