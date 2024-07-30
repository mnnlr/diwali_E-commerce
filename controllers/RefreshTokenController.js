import { ErrorHandler } from "../utils/ErrorHandler.js";
import User from "../model/User.js";

import Jwt from "jsonwebtoken";

const getRefreshToken = async (req, res,next) => {

    try {
    
        const cookies = req.cookies;

        if(!cookies?.token) return next(new ErrorHandler(401,'Please logIn to access'));
        
        const refreshToken = cookies.token;

        const foundUser = await User.findOne({refreshToken:refreshToken});

        if(!foundUser) return next(new ErrorHandler(401,'Please logIn to access'));

        Jwt.verify(refreshToken,process.env.JWT_REFRESH_TOKEN_SECRET,(err,decodedUser)=>{

            if(err || foundUser?._id?.toString() !== decodedUser?._id) {
                return next(new ErrorHandler(401,'Please logIn to access'));
            }

            const accessToken = Jwt.sign({_id:foundUser._id},process.env.JWT_ACCESS_TOKEN_SECRET,{expiresIn:'1h'});
            res.status(200).json({accessToken});
        });
        
    } catch (error) {
        next(error)
    }
    
}

export {getRefreshToken};
