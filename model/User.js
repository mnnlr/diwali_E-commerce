import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
   email:{
      type: String, 
      require: true,
      unique : true
   },
   password: {
       type: String,
       require: true,
      
   },
   role:{
       type: String,
       require: true,
       default: "user",
   },
   refreshToken:{
       type: String,
       require: false,
   }
});

const UserModel = mongoose.model('User', Schema);

export default UserModel;