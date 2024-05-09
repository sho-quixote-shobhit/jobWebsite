import { Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast, Box } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import ProfileListItem from './ProfileListItem'
import { useUser } from '../providers/userContext'

const AddProfile = ({ setprofile, children }) => {

    const [loading, setloading] = useState(false)
    const [search, setsearch] = useState('')
    const [searchResults, setsearchResults] = useState([])
    const [selectedprofile, setselectedprofile] = useState();

    const [addloading, setaddloading] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast();

    const { user, setuser } = useUser();

    const handlesearch = async (query) => {
        setsearch(query);
        if (!query) {
            toast({
                title: 'Search cant be empty!!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            return;
        }
        try {
            setloading(true);
            await axios.get(`http://localhost:5000/user/getprofiles?search=${search}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                }
            }).then(res => {
                setsearchResults(res.data.profiles)
                setloading(false)
            })
        } catch (error) {
            toast({
                title: 'Failed To Load!!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            console.log(error)
            return;
        }
    }

    const handleProfile = async (profile) => {
        setselectedprofile(profile);
    };

    const handlerecruiter = () => {
        setprofile(selectedprofile)
        setsearchResults([]);
        setselectedprofile();
        setaddloading(false);
        onClose();
    }

    const handleSubmit = async () => {
        setaddloading(true);
        user && user.profession === 'Student' ? (
            await axios.put('http://localhost:5000/user/addprofile', { newprofile: selectedprofile }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                }
            }).then(res => {
                setuser(res.data.user);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                toast({
                    title: 'Profile added successfully!!',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
                setsearchResults([]);
                setselectedprofile();
                setaddloading(false);
                onClose();
            }).catch(error => {
                console.log(error);
            })
        ) : (
            handlerecruiter()
        )
    }


    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal closeOnOverlayClick={false} isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Choose Job Profile</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {addloading && <Spinner w={5} h={5} />}
                        {selectedprofile && <Box mb={1} p={1} borderRadius='10px' bg='black' color='white'>{selectedprofile.profile}</Box>}
                        <FormControl>
                            <Input
                                placeholder='search profiles'
                                mb={3}
                                onChange={(e) => { handlesearch(e.target.value) }}
                            />
                        </FormControl>
                        {loading ? (<Spinner />) : (
                            searchResults?.slice(0, 4).map((profile) => {
                                return (
                                    <ProfileListItem profile={profile} key={profile._id} handleFunction={() => handleProfile(profile)} />
                                )
                            })
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button size='sm' colorScheme='blue' isDisabled={!selectedprofile ? true : false} onClick={handleSubmit} >Add</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AddProfile