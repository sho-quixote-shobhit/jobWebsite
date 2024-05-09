import React, { useState } from 'react';
import {
    Flex,
    Heading,
    Input,
    Button,
    Center,
    Box,
    useToast
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useUser } from '../providers/userContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const toast = useToast();
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [showpass, setshowpass] = useState(false)
    const [loading, setloading] = useState(false)

    const { setuser } = useUser()
    const navigate = useNavigate();

    const handleshow = () => {
        if (showpass) {
            setshowpass(false);
        } else setshowpass(true);
    }

    const handleLogin = async () => {
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
        if (!email || !password) {
            toast({
                title: 'Fill All the Fields!!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            return;
        }
        setloading(true)
        await axios.post('http://localhost:5000/auth/signin', { email, password }, { withCredentials: true }).then((res) => {
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
                title: 'Login Successfull',
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
        handleLogin();
    };

    return (
        <Flex mt={10} h={{ base: '70vh', sm: '70vh', md: '70vh', lg: '70vh' }} alignItems="center" justifyContent="center">
            <Flex
                as="form"
                w={{ base: '90vw', sm: '75vw', md: '70vw', lg: '35vw' }}
                flexDirection="column"
                p={12}
                borderRadius={8}
                boxShadow="5px 5px 5px 5px pink"
                onSubmit={handleSubmit}
            >
                <Center><Heading mb={6}>Log In</Heading></Center>
                <Box>
                    <Input
                        placeholder="johndoe@gmail.com"
                        type="email"
                        mb={3}
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                    />
                </Box>
                <Box position="relative" mb={6} variant="filled">
                    <Input type={showpass ? 'text' : 'password'} placeholder='******' value={password} onChange={(e) => setpassword(e.target.value)} />
                    <Box position="absolute" right="10px" top="50%" transform="translateY(-50%)" cursor="pointer">
                        {showpass ? <ViewOffIcon onClick={handleshow} /> : <ViewIcon onClick={handleshow} />}
                    </Box>
                </Box>
                <Box><Button colorScheme="pink" isLoading={loading} loadingText="Logging In" type='submit'>Login</Button></Box>
            </Flex>
        </Flex>
    );
};

export default Login;
