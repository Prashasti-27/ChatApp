import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./Reoutes/userRoutes.js";
import messageRouter from "./Reoutes/MessageRoutes.js";
import { Server } from "socket.io";
import { Socket } from "dgram";

const app= express();
const server =http.createServer(app)


//initialize socket.io server
export const io= new Server(server, {
    cors: {origin: "*"}
})

export const userSocketMap= {}     //{uerId: socketId}


//Socket.io connection handler

io.om("connection" , (socket)=> {
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);

    if(userId) userSocketMap[userId]= socket.userId;

    //emit online user to all connected client\\\
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
        socket.om("disconnect", ()=>{
            console.log("User Disconnected", userId);
            delete userSocketMap[userId];
            io.emit("getOnlineUsers",  Object.keys(userSocketMap))
            
        })
})

//middleware setup
app.use(express.json({limit:"4mb"}));
app.use(cors());


// Routes setup
app.use("/api/status", (req,res)=> {res.send("Server is live!!");
    app.use("/api/auth",userRouter)
app.use("/api/messages", messageRouter)


});


//Connect to mongoose
await connectDB();


const PORT =process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server is running on PORT :" +PORT));