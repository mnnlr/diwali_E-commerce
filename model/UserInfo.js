import mongoose from "mongoose";

const userInfo = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    addresses: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "registations",
    },
    email:String,
    phone:Number,
    city:String,
    state:String,
    country:String,
    postalCode:Number
});

const UserInfo = mongoose.model("userInfo", userInfo)

export default UserInfo;