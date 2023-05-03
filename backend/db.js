const mongoose = require('mongoose');

// const mongoURI = "mongodb://localhost:27017/?readPreference=primary&appName=MongoDB%20Compass&directConnection=true&ssl=false"

const connectToMongo = () => {
    // mongoose.connect('mongodb://127.0.0.1:27017/inotebook')
        mongoose.connect('mongodb://127.0.0.1:27017/inotebook')

        console.log("Connected to Mongo Successfully");
    }
module.exports = connectToMongo;