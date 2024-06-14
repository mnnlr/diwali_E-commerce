import mongoose from 'mongoose';


const userSchema = mongoose.Schema({
   
    email:{
       type: String, 
       require: true,
    },
    password: {
        type: String,
        require: true,
        select: false,
    },
    role:{
        type: String,
        require: true,
        default: "user",
    }
});

const User = mongoose.model("user", userSchema)

export default User;