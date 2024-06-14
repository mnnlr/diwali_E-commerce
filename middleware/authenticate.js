import jwt, { decode } from "jsonwebtoken";

const isAuthenticated = async(req,res,next) => {
    try {

            const authHeader = req.headers['Authorization'] || req.headers['authorization']
            console.log('this is authHeader--->', authHeader);   
            // if(!authHeader) return next(new ErrorHandler(401,"Please logIn to access"))
            if(!authHeader) return res.status(401).json({success: false, message: "authentication failed"})

            const token = authHeader.split(' ')[1]
            // if(!token) return next(new ErrorHandler(401,"Please logIn to access"))
            if(!token) return res.status(401).json({success: false, message: "authentication failed with token"})
            const decodedData = jwt.verify(token,process.env.JWT_FS_ACCESS_TOKEN)
            console.log(decodedData);
            const {userId} = decodedData;
            req.user = {_id: userId}
            // console.log(req.user);
            next()

    } catch (error) {
        // next(new ErrorHandler(403,"forbidden"))
        return res.status(403).json({success: false, message: "isAutheticated Failed"})
    }


}

export {isAuthenticated};