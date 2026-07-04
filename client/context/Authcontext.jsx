import { children, createContext, useEffect, useState } from "react";
import axios from 'axios';
import toast from "react-hot-toast";
import { io } from 'socket.io-client'



const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL= backendUrl;

//console.log("Backend URL:", backendUrl);


export const Authcontext = createContext();


export const AuthProvider = ({ children }) => {

    const [loading, setLoading] = useState(true);

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    // Check if user is authenticated and if so, set the user data and connect the socket;
const checkAuth = async () => {
    try {
        if (!token) {
            setLoading(false);
            return;
        }

        const { data } = await axios.get("/api/auth/check");
        console.log("checkAuth:", data);

        if (data.success) {
            setAuthUser(data.user);
            connectSocket(data.user);
        }
    } catch (error) {
        console.log(error);
        // DON'T clear authUser here
    } finally {
        setLoading(false);
    }
};


    //Login fun to handle user authentication
    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
          console.log("Login API Response:", data);
            if (data.success) {

                  console.log("Setting authUser:", data.userData);
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token)
                 window.dispatchEvent(new Event("refreshUsers"));
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
           toast.error(
        error.response?.data?.message || error.message
    );
        }
    }

    //logout function
    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([])
        axios.defaults.headers.common["token"] = null;
        toast.success("Logout Successfully")
        socket.disconnect();
    }

    //Update profile function to handle user profile update
    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put("/api/auth/update-profile", body)
            if (data.success) {
                setAuthUser(data.user);
                 const fresh = await axios.get("/api/auth/check");
                  if (fresh.data.success) {
        setAuthUser(fresh.data.user);
      }
                toast.success("Profile updated successfully")
                return data;
            }
        } catch (error) {
            toast.error(error.message)
        }
    }



    //Connect socket function to handle socket condition and online user updates
    const connectSocket = (userData) => {
        if (!userData || socket?.connected ) return;
        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            }
        }   );
         newSocket.connect();
         setSocket(newSocket);

        newSocket.on('getOnlineUsers', (userIds) => {
            setOnlineUsers(userIds);
        })
    }
useEffect(() => {
  if (token) {
    axios.defaults.headers.common["token"] = token;
  }
  checkAuth();
}, [token]); 



    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
        loading

    }
    return (
        <Authcontext.Provider value={value}>
            {children}
        </Authcontext.Provider>
    )
}