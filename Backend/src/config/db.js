const mongoose = require('mongoose');

async function connectDB() {

    try {
        
        await mongoose.connect(process.env.MONGO_URL);
        console.log('DB is connected to Server');
        
        
    } catch (error) {
        console.log(error);
        
    }
    
}

module.exports = connectDB;