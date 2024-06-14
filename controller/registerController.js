import User from "../models/user.js";
import UserInfo from "../models/userInfo.js";
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  if (!user) {
    return res.status(500).json({ sucess: false, message: "Server Error" });
  }
  const userInfo = await user.save();

  await UserInfo.create({
    name: name,
    userId: userInfo._id,
    userRole: userInfo.role,
    cart: [],
    wishList: [],
  });
  res.send("User created successfully!");
};

export default registerUser;
