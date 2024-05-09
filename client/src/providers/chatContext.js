const { createContext, useState, useContext } = require("react");

const ChatContext = createContext();

export const useChat = () =>{
    return useContext(ChatContext)
}

export const ChatProvider = (props) => {
    const [selectedChat, setselectedChat] = useState('')
    const [chats, setchats] = useState([])
    const [notification, setnotification] = useState([])

    
    return(
        <ChatContext.Provider value={{selectedChat, setselectedChat , chats, setchats , notification , setnotification}}>
            {props.children}
        </ChatContext.Provider>
    )
}

