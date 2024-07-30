import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
    seller : {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
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

export default GirlModel;