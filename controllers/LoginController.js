import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from '../model/User.js';
import UserInfo from '../model/UserInfo.js';

const Login =  async (req, res) => {
  
  try {
    
      const { email, password } = req.body;
      
      const user = await User.findOne({ email }).select("+password");
      const userInfo = await UserInfo.findOne({ userId: user._id });
      
      console.log("this is user-->", user);
      
      if (!user) {
        return res.status(401).json({success:true,message:"Email not Register"});
      }

      console.log('Stored hashed password:', user.password);

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) return res.status(401).json({success:false,message:"invalid credentials"});

      const accessToken = jwt.sign(
        { userId: user._id },
          process.env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        { userId: user._id },
          process.env.JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: "15" }
      );

      const cookieOptions = {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        sameSite: "None",
        httpOnly: true,
        secure: true,
        // signed : true
      };
    
      const { email: userEmail,role,_id } = user;
      res.cookie("token", refreshToken, cookieOptions);

      res
        .status(200)
        .json({
          success:true,
          Data: {
            _id,
            name: userInfo.name,
            email: userEmail,
            userRole: role,
            token:accessToken,
          },
        });

  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send("Your Email and Password is Invalid Please try agian or Register");
  }
  };    

export {Login}