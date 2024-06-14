import UserInfo from "../models/userInfo.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParse from "cookie-parser";
import express from "express";
import User from "../models/user.js";
const app = express();


app.use(cookieParse(process.env.COOKIE_SECRET));

const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email }).select("+password");
      const userInfo = await UserInfo.findOne({ userId: user._id });
      console.log("this is user-->", user);
      if (!user) {
        return res.status(401).send("Email not Register");
      }
  
      // console.log('Stored hashed password:', user.password);
      // console.log('Incoming plain password:', password);
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        // Debug: Log a message indicating the password comparison failed
        // console.log('Password comparison failed');
        return res.status(401).send("Invalid password");
      }
  
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_FS_ACCESS_TOKEN,
        { expiresIn: "1h" }
      );
      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_FS_REFRESH_TOKEN,
        { expiresIn: "1h" }
      );
      const cookieOptions = {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        sameSite: "None",
        httpOnly: true,
        secure: true,
        // signed : true
      };
      const { email: userEmail, _id } = user;
      res.cookie("token", refreshToken, cookieOptions);
      res
        .status(200)
        .send({
          data: {
            name: userInfo.name,
            email: userEmail,
            _id,
            userInfoId: userInfo._id,
            userRole: userInfo.userRole,
            token,
            cart:[]
          },
        });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .send("Your Email and Password is Invalid Please try agian or Register");
    }
  };

  export default loginUser;