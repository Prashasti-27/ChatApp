import Message from '../models/message';
import User from '../models/User'


//get all users except login user

export const getUserForSidebar= async(req,res)=> {
    try{
        const userId = req.user._id;
        const filterUsers= await User.find({_id: {$ne: userId}}).select("-password");

        //Count number of unseen msg

        const unseenMessages= {}
        const promises=filterUsers.map(async(user)=>{
            const messages=await Message.find({senderId: user._id, recieverId:userId, seen: false})
            if(messages.length> 0){
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success:true, users:filterUsers, unseenMessages})
    }catch(error){
        console.log(error.message);
          res.json({success:false,message:error.messag})
        
    }
}

//Get all messages for selected user
export const getMessages= async(req,res)=> {
    try {
        const { id: selectedUserId } = req.params;
            const myId =req.user._id;
            const messages= await Message.find({
                $or:
                [{senderId:myId, recieverId: selectedUserId},
                {senderId:selectedUserId, recieverId: myId}]
            })
            await Message.updateMany({senderId:selectedUserId, recieverId: myId}, {seen: true});

            res.json({success:true, messages});
    }catch (error) {
        console.log(error.message);
        
    }
}