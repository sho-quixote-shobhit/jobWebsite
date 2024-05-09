import React, { useState } from 'react'
import { Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'
import axios from 'axios'
import { useUser } from '../providers/userContext'

const AddImage = ({ children , frontloading }) => {
    const [image , setimage] = useState(null);
    const [imgurl , setimgurl] = useState('');
    const [imgloading , setimgloading] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [loading , setloading] = useState(false);

    const toast = useToast();

    const handleProfilePic = async () => {
        if (!image) {
            toast({
                title: 'Select an image!!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            return;
        }
        const formData = new FormData();
        formData.append('key', 'c060d25b69b68bc751a850dde2affec8')
        formData.append('image', image)
        setimgloading(true)
        await axios.post('https://api.imgbb.com/1/upload', formData, { timeout: 60000 }).then(res => {
            setimgurl(res.data.data.url)
        })
        setimgloading(false)
    }

    const {setuser} = useUser();

    const updatePic = async() => {
        if(!imgurl){
            toast({
                title: 'Select an image!!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            return;
        }
        setloading(true)
        await axios.put('http://localhost:5000/user/addpic' , {imgurl} , {headers : {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer ' + localStorage.getItem('jwt')
        }}).then(res => {
            setuser(res.data.user)
            localStorage.setItem('user', JSON.stringify(res.data.user))
            setloading(false);
            setimgurl('')
            setimage(null)
            toast({
                title: 'Profile Pic Updated Successfully!!',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
            frontloading(true)
            onClose();
            return;
        })
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal closeOnOverlayClick={false} isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Select an image</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <Input
                                placeholder='search Skills'
                                type='file'
                                accept='.png , .jpeg, .jpg, .webp'
                                onChange={(e)=>{setimage(e.target.files[0])}}
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={handleProfilePic} isLoading = {imgloading} isDisabled = {!imgurl ? false : true} colorScheme='blue' loadingText="Uploading" size='sm' mx={2}>{!imgurl ? 'Upload' : <CheckIcon />}</Button>
                        <Button onClick={updatePic} isLoading = {loading} isDisabled = {!imgurl ? true : false} colorScheme='green' loadingText="Saving" size='sm' mx={2}>Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AddImage