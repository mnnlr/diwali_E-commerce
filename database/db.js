import mongoose from 'mongoose';


const db = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('database Connected')
    }catch (error){
         console.log('Error when data base connection', error)
    }
}

export default db;