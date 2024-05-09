import { Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import { useUser } from '../providers/userContext'


const AddResume = ({ children }) => {
    const [file, setfile] = useState(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast();
    const [loading, setloading] = useState(false)

    const { setuser } = useUser();

    const handleUpload = async (e) => {
        if (!file) {
            toast({
                title: 'Select a file!!',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
        }
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        setloading(true)
        await axios.post('http://localhost:5000/user/addresume', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => {
            setloading(false);
            setuser(res.data.user)
            localStorage.setItem('user', JSON.stringify(res.data.user))
            toast({
                title: 'Profile was updated successfully!!',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
            onClose()
            return;
        })
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal closeOnOverlayClick={false} isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Select Resume(.pdf)</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <Input
                                placeholder='search Skills'
                                type='file'
                                accept='.pdf'
                                onChange={(e) => { setfile(e.target.files[0]) }}
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button isLoading = {loading} loadingText = 'Adding Resume' onClick={(e) => { handleUpload(e) }} colorScheme='blue' >Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AddResume