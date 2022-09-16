const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', ()=>{
    console.log('MongoDB connection is successful');
});
mongoose.connection.on('err', (err)=>{
    console.log(`Could not connect to DB due to ${err}`);
});

async function mongoConnect(){
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect(){
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
}