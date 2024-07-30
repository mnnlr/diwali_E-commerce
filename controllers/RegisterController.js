import User from '../model/User.js';
import UserInfo from '../model/UserInfo.js';
import bcrypt from "bcrypt";

//shawmanish2580@gmail.com
//rahulpharthyal04@gmail.com
//yashmaurya@gmail.com
//suraj@gmail.com


const Register = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      console.log(name, email, password)

      if(!name || !email || !password){
        return res.status(400).json({success:false,message:"Please enter all fields"});
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('hashedPassword',hashedPassword)
      const user = new User({ email, password: hashedPassword });
      
      if (!user) {
        return res.status(500).json({ sucess: false, message: "Server Error" });
      }
      
      const userInfo = await user.save();
    
      await UserInfo.create({
        name: name,
        email: email,
        userId: userInfo._id,
      });
      
      res.send("User created successfully!");
    
    } catch (err) {
  
      res.status(400).send({ error: err.message });
  
    }
  
  };

export {Register}