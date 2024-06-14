import User from "../models/user.js";
import UserInfo from "../models/userInfo.js";
import jwt from 'jsonwebtoken';

const authenticate = async(req,res,next)=>{
    try {

        const {_id} = req.user;
        console.log('this is id', _id)
        const foundUser = await User.findOne({_id:_id});

        const userInfo = await UserInfo.findOne({userId:_id})
        // console.log('this is userinfo-->', userInfo)
        // if(!foundUser) return next(new ErrorHandler(404,'Invalid username or password'));
        if(!foundUser) return res.status(404).json({sucess: false, message: "User not found"});
        const token = jwt.sign({ userId: foundUser._id }, process.env.JWT_FS_ACCESS_TOKEN, { expiresIn: '1h' });

        res.status(200).json({success:true, data:{_id: foundUser._id, name: userInfo.name, email: foundUser.email, userInfoId: userInfo._id, token}})

    } catch (error) {
        res.status(500).json({success:false, message: error.message})
    }
}


export {authenticate};