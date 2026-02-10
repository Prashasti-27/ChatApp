import { createContext, useContext, useEffect, useState } from "react";
import { Authcontext } from "./Authcontext";
import toast from "react-hot-toast";





export const ChatContext = createContext();


export const ChatProvider = ({children}) =>{

const [messages, setMessages] = useState([]);
const [users, setUsers] = useState([]);
const [selectedUser, setSelectedUser] = useState(null);
const [unseenMessages, setUnseenMessages] = useState({});


    const {socket , axios} = useContext(Authcontext);

    //function to get all users for sidebar
    const getUsers =async()=> {
        try {
           const {data} = await axios.get("api/messages/users");
           if(data.success){
            setUsers(data.users);
            setUnseenMessages(data.unseenMessages)
           }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //fun to get messages for selected user
    const getMessages = async(userId) => {
        try {
          const  {data}  = await axios.get(`/api/messages/${userId}`)
          if(data.success){
            setMessages(data.messages)
          }
        } catch (error) {
             toast.error(error.message)
        }
    }

    //fun to send messaes t0 selected user
    const sendMessage = async(messageData) => {
        try {
            const {data} =await axios.post(`/api/messages/send/${selectedUser._id}`, messageData)
            if(data.success){
                setMessages((prevMessages)=>[...prevMessages,data.newMessage])
            }else{
                toast.error(data.message)
            }
        } catch (error) {
              toast.error(error.message)
        }
    }

    //funtiom to subscrive to messages for selected user
    const subscribetoMessages=async() => {
        if(!socket) return;

        socket.on("newMessage" , (newMessage)=> {
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen =true;
                setMessages((prevMessages) => [...prevMessages,newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`)
            }else{
                setUnseenMessages((prevUnseenMessages)=> ({
                    ...prevUnseenMessages, [newMessage.senderId]: prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] +1 :1
                }))
            }
        })
    }

//fun to unsubscribe from messages
const unsubscribefromMessages =()=> {
    if(socket) socket.off("newMessage")
}

useEffect(()=>{
     subscribetoMessages();
     return()=> unsubscribefromMessages();
} , [socket, selectedUser])



const value= {
messages,users,selectedUser,getUsers,setMessages,sendMessage,setSelectedUser,unseenMessages,setUnseenMessages
};

    return (
        <ChatContext.Provider value={value}>
        {children}
        </ChatContext.Provider>

    )
}
export default ChatProvider;
