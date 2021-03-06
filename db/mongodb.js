const mongoose = require("mongoose");

const connectMongo = async () => {
    const client = await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return client;
};

module.exports = { connectMongo };

// const { MongoClient } = require('mongodb');

// const dotenv = require('dotenv');
// const path = require('path');

// dotenv.config({ path: path.join(__dirname, '.env') })

// const url = process.env.MONGODB_URL;
// const dbName = process.env.MONGODB_NAME;

// async function main() {
//     const client = new MongoClient(url);
//     await client.connect();
//     console.log('Connected successfully to server');
//     const db = client.db(dbName);
//     const dbContacts = db.collection('documents');

//     dbContacts.insertOne({});

//     return 'done.';
// }

// main();