const { MongoClient } = require('mongodb');

const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname. '.env') })

const url = process.env.MONGODB_URL;
const client = new MongoClient(url);

// Database Name
const dbName = process.env.MONGODB_NAME;

async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('documents');

    // the following code examples can be pasted here...

    return 'done.';
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());