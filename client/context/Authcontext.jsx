import { Children, createContext, useState } from "react";
import axios from 'axios';
import toast  from "react-hot-toast";
 
const backendUrl= import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseUrl=backendUrl;



export const Authcontext= createContext();


export const AuthProvider= ({children})=>{

    const [token,setToken]= useState(localStorage.getItem("token"));
    const[authUser, setAuthUser] =useState(null);
    const[onlineUser, setOnlineUser] =useState([]);
    const[socket, setSocketr] =useState(null);

        const checkAuth =async()=> {
            try{
                const {data}= await axios.get("/api/auth/check");
                if(data.success){
                    setAuthUser(data.user)
                }
            }catch(error){
                    toast.error(error.message)
                    
                }
        }


    const value= {
            axios,
            authUser,
            onlineUser,
            socket

    }
    return (
        <Authcontext.Provider value={value}>
            {children}
        </Authcontext.Provider>
    )
}