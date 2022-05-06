const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//middleware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eut81.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const enventoryCollection = client.db('inventoryManagement').collection('inventory');
        console.log('inventory connected');
        
        // create all inventory API
        //  http://localhost:5000/inventory
        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = enventoryCollection.find(query);
            const inventory = await cursor.toArray();
            res.send(inventory);
        });
        
        // http://localhost:5000/inventory/6273af02f96b62d28d55e230
        // get single inventory APL
         app.get('/inventory/:id', async(req, res) =>{
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const inventory = await enventoryCollection.findOne(query);
            res.send(inventory);
        });
        //  http://localhost:5000/inventory
         // POST single inentory data
         app.post('/inventory', async(req, res) =>{
            const newInventory = req.body;
            const result = await enventoryCollection.insertOne(newInventory);
            res.send(result);
        });
    }
    finally {

    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('enventory-management');
});


app.listen(port, () => {
    console.log('listening to port', port);
})