import mongoose from 'mongoose';
 
const userInfo = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    addresses: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
    },
    userRole: {
        type: String,
        ref: "user"
    },
    cart:{
        type: Array,
    },
    wishList: {
        type: Array,
    }
});

const UserInfo = mongoose.model("userInfo", userInfo)

export default UserInfo;
