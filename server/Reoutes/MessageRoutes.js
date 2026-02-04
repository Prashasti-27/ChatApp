import express from "express"
import {protectRoute} from "../middleware/auth"
import {getMessages, getUserForSidebare, markMessageAsSeen} from "../controllers/messageController"




const messageRouter=  express.Router();

messageRouter.get("/users", protectRoute, getUserForSidebar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("mark/:id", protectRoute, markMessageAsSeen);



export default messageRouter;


