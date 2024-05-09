import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt'
import { Box } from '@chakra-ui/react';

const Meeting = () => {
    const {meetId} = useParams();
    const [userId , setuserId] = useState('');
    const [userName , setuserName] = useState('');

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('user'));
        if (userInfo) {
            console.log(userInfo)
            setuserId(userInfo._id)
            setuserName(userInfo.name)
        }
        console.log(meetId)
    } , [])


    const Meeting = async (element) => {
        const appID = 1763020637;
        const serverSecret = 'fdad804d33b4afab696b442755d9c0fe';
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret , meetId , userId , userName)
        console.log(kitToken)
        const zc = ZegoUIKitPrebuilt.create(kitToken);
        zc && zc.joinRoom({
            container : element,
            scenario : {
                mode : ZegoUIKitPrebuilt.OneONoneCall,
            },
        })
    }
    return (
        <Box mt={5}>
            <Box ref={Meeting} style={{height : '60vh'}} />
        </Box>
    )
}

export default Meeting