const express = require('express');
const cors = require('cors');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000

//middle ware use

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sqr2p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT (req,res,next){
    const authHeader = req.headers.authorization;
           
            if(!authHeader){
                return res.status(401).send({message:"unathorized"})
            }
            const token = authHeader.split(' ')[1]
            jwt.verify(token, process.env.TOKEN, (err, decoded)=> {
                if(err){
                    return res.status(403).send({message:"Forbidden"}) 
                }
                req.decoded=decoded
                next()
              });
            
   
}


async function run() {
    try {
        await client.connect();
        //  const collection = client.db("test").collection("devices");
        const serviceCollection = client.db("geniusCar").collection("service")
        const orderCollection = client.db("geniusCar").collection("order")

        //auth
        app.post('/login', async (req, res) => {
            const user = req.body;
            console.log(user);
            const accessToken = jwt.sign(user, process.env.TOKEN, {
                expiresIn: "1d"
            })
            res.send({ accessToken })

        })


        // add get and fetch all data 

        app.get('/service', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const service = await cursor.toArray()
            res.send(service)
        })

        //add get and fetch one data

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query)
            res.send(service)

        })

        //use post api method
        app.post('/service', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService)
            res.send(result)
        })

        //use delete method api

        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await serviceCollection.deleteOne(query)
            res.send(result)

        })

        //checkout route for get api
        app.get('/checkout/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }

            const service = await serviceCollection.findOne(query)
            res.send(service)
        })
        //get api used for order
        app.get('/order',verifyJWT, async (req, res) => {
            const decodeEmail=req.decoded.email

            console.log(decodeEmail);
         
            const email = req.query.email;
            if(decodeEmail===email){
                const query = { email: email };
                const cursor = orderCollection.find(query)
                const result = await cursor.toArray()
                res.send(result)
            }
            
           

        })

        //order post api 
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            res.send(result)

        })


    }
    finally {

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('server is working')

})

app.listen(port, () => {
    console.log('listening to port', port);
})
