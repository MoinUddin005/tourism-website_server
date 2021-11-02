const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mygeh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('dreamHolidays');
        const servicesCollection = database.collection('services');
        const orderCollection = database.collection('orders');

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // GET Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });

        //insert order
        app.post('/placeOrder', async (req, res) => {
            const data = req.body;
            const result = await orderCollection.insertOne(data);

            res.send(result);
        })
        
        //get order by email
        app.get('/myOrder', async (req, res) => {
            const email = req.query.email;
            console.log('database hitted');
            const query = { "email": email };
            const result = await orderCollection.find(query).toArray();
            res.json(result);
        })

        // DELETE API
        app.delete('/myOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Dream Holidays Server');
});

app.listen(port, () => {
    console.log('Running  Dream Holidays Server on port', port);
})

/*
one time:
1. heroku account open
2. Heroku software install

Every project
1. git init
2. .gitignore (node_module, .env)
3. push everything to git
4. make sure you have this script:  "start": "node index.js",
5. make sure: put process.env.PORT in front of your port number
6. heroku login
7. heroku create (only one time for a project)
8. command: git push heroku main

----
update:
1. save everything check locally
2. git add, git commit-m", git push
2. git push heroku main
*/