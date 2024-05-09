import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { Avatar, Tooltip } from '@chakra-ui/react'
import { useUser } from '../../providers/userContext'

const ScrollableChat = ({ messages }) => {
    const { user } = useUser()

    const isSameSender = (messages, m, i, userId) => {
        return (i < messages.length - 1) && (messages[i + 1].sender._id !== m.sender._id || messages[i + 1].sender._id === undefined) && messages[i].sender._id !== userId
    }

    const isLastMessage = (messages, i, userId) => {
        return (
            (i === messages.length - 1) && (messages[messages.length - 1].sender._id !== userId) && (messages[messages.length - 1].sender._id)
        )
    }

    return (
        <ScrollableFeed>
            {messages && messages.map((m, i) => {
                return (
                    <div className='my-2' style={{ display: 'flex', flexDirection: 'row', justifyContent: `${m.sender._id === user._id ? 'space-between' : ''}`, alignItems: 'center' }} key={m._id}>
                        <i></i>
                        <div style={{ display: 'flex' }}>
                            <span>{
                                (isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) &&
                                <>
                                    <Tooltip
                                        label={m.sender.name}
                                        placement='bottom-start'
                                        hasArrow
                                    >
                                        <Avatar
                                            mt='7px'
                                            mr={1}
                                            size="sm"
                                            cursor='pointer'
                                            name={m.sender.name}
                                            src={m.sender.photo}
                                        />
                                    </Tooltip>
                                </>

                            }</span>
                            {isSameSender(messages, m, i, user._id) || !isLastMessage(messages, i, user._id) && <p style={{margin : '0 0 0 36px'}}></p>}
                            <span style={{ backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`, borderRadius: "20px", padding: "5px 15px", alignSelf: 'center'  , margin : '1px 0'}}>
                                {m.content}
                            </span>
                        </div>
                    </div>
                )
            })}
        </ScrollableFeed>
    )
}

export default ScrollableChat