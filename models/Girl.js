import mongoose from 'mongoose';


const Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
       
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type:  String
    },
    q: {
        type: Number,
        required: true
    }
});

const GirlModel = mongoose.model('Girl', Schema);

export {GirlModel}