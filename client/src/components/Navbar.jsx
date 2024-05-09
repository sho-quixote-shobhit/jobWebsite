import React from 'react';
import { Box, Drawer, DrawerOverlay, DrawerContent, VStack, Text, HStack, useDisclosure, Menu, MenuButton, Avatar, MenuList, MenuDivider, MenuItem, Button } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../providers/userContext';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const Navbar = () => {
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, setuser } = useUser();

    const handleItemClick = () => {
        onClose();
    };

    const handleLogout = () => {
        confirmAlert({
            message: `Are you sure to Logout!!`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => { 
                        localStorage.clear();
                        setuser()
                        navigate('/')
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }

    const handleLogo = () => {
        navigate('/')
    }

    return (
        <Box w="100%" boxShadow="3px 3px 3px 0 pink">
            <Box w="80%" m="auto auto" py={4} color="black" display="flex" justifyContent="space-between" alignItems="center">
                    <Text cursor="pointer" fontSize="2xl" p={2} _hover={{ bg: 'pink.200' }} borderRadius='10px' onClick={handleLogo}>
                    Meowदिहाड़ी
                    </Text>
                <Box display="flex" alignItems="center">
                    <HStack spacing="10px" display={{ base: 'none', md: 'flex' }}>
                        {!user ? (
                            <>
                                <Link to="/signup">
                                    <Text cursor="pointer" p={2} _hover={{ bg: 'pink.200' }}  borderRadius='10px'>
                                        SignUp
                                    </Text>
                                </Link>
                                <Link to="/login">
                                    <Text cursor="pointer" p={2} _hover={{ bg: 'pink.200' }} borderRadius='10px'>
                                        Login
                                    </Text>
                                </Link>
                            </>
                        ) : (
                            <>
                                {user.profession === 'Student' ? (<Link to="/applications">
                                    <Text cursor="pointer"  p={2} _hover={{ bg: 'pink.200' }} borderRadius='10px'>My Appliactions</Text>
                                </Link>) : (<></>)}
                                {user.profession === 'Student' ? (<></>) : (<Link to="/jobsoffered">
                                    <Text cursor="pointer"  p={2} _hover={{ bg: 'pink.200' }} borderRadius='10px'>Jobs Offered</Text>
                                </Link>)}
                                <Link to="/joinmeeting">
                                    <Text cursor="pointer"  p={2} _hover={{ bg: 'pink.200' }} borderRadius='10px'>Join a Meeting</Text>
                                </Link>
                                <Link to="/chats">
                                    <Text cursor="pointer"  p={2} _hover={{ bg: 'pink.200' }} borderRadius='10px'>Chats</Text>
                                </Link>
                                <Menu>
                                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                        <Avatar size='sm' cursor='pointer' name={user.name} src={user.photo} />
                                    </MenuButton>
                                    <MenuList>
                                        {/* to see profile add profile modal or simply edit profile page */}
                                        <Link to = "/editprofile"><MenuItem>Profile</MenuItem></Link>
                                        <MenuDivider />
                                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                    </MenuList>
                                </Menu>
                            </>
                        )}
                    </HStack>
                    <HamburgerIcon cursor="pointer" w={7} h={7} display={{ base: 'flex', md: 'none' }} onClick={onOpen} />
                </Box>
            </Box>

            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <Box display="flex" justifyContent="flex-end">
                        <CloseIcon cursor="pointer" m={4} onClick={onClose} />
                    </Box>
                    <VStack h="100vh" display="flex" justifyContent="center" alignItems="center" spacing={4}>
                        {!user ? (
                            <>
                                <Link to="/login">
                                    <Text w="100%" display="flex" p={2} justifyContent="center" onClick={handleItemClick} _hover={{ bg: 'pink.200' }} borderRadius='10px'>
                                        Login
                                    </Text>
                                </Link>
                                <Link to="/signup">
                                    <Text w="100%" display="flex" p={2} justifyContent="center" onClick={handleItemClick} _hover={{ bg: 'pink.200' }} borderRadius='10px'>
                                        SignUp
                                    </Text>
                                </Link>
                            </>
                        ) : (
                            <>
                                {user.profession === 'Student' ? (<Link to="/applications">
                                    <Text cursor="pointer" p={2}   _hover={{ bg: 'pink.200' }} onClick={handleItemClick} borderRadius='10px'>Jobs Applied</Text>
                                </Link>) : (<Link to="/newjob">
                                    <Text cursor="pointer"  p={2}  _hover={{ bg: 'pink.200' }} onClick={handleItemClick} borderRadius='10px'>Add New Job</Text>
                                </Link>)}
                                <Link to="/joinmeeting">
                                    <Text cursor="pointer"  p={2}  _hover={{ bg: 'pink.200' }} onClick={handleItemClick} borderRadius='10px'>Join a Meeting</Text>
                                </Link>
                                <Link to="/chats">
                                    <Text cursor="pointer"  p={2}  _hover={{ bg: 'pink.200' }} onClick={handleItemClick} borderRadius='10px'>Chats</Text>
                                </Link>
                                <Link to="/editprofile">
                                    <Text w="100%" display="flex" p={2} justifyContent="center" onClick={handleItemClick} _hover={{ bg: 'pink.200' }} borderRadius='10px'>Edit Profile</Text>
                                </Link>
                                <Link to="/logout">
                                    <Text w="100%" display="flex" p={2} justifyContent="center" onClick={handleLogout} _hover={{ bg: 'pink.200' }} borderRadius='10px'>
                                        Logout
                                    </Text>
                                </Link>
                            </>
                        )}
                    </VStack>
                </DrawerContent>
            </Drawer>
        </Box>
    );
};

export default Navbar;
