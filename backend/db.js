const mongoose = require('mongoose');
const mongoURI="mongodb://localhost:27017/itask"

const connectToMongo =  ()=>{
    mongoose.connect(mongoURI);
}

module.exports = connectToMongo;