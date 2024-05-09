import React , { createContext, useContext, useEffect, useState } from 'react'

const UserContext = createContext();

export const useUser = () =>{
    return useContext(UserContext);
}
export const UserProvider = (props) => {
    const [user, setuser] = useState()

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('user'));
        if(userInfo){
            setuser(userInfo)
        }

    }, [])
    
    return (
        <UserContext.Provider  value={{user,setuser}}>
            {props.children}
        </UserContext.Provider>
    )
}
