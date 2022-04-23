const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT ||5000

//middle ware use

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sqr2p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
       //  const collection = client.db("test").collection("devices");
        const serviceCollection = client.db("geniusCar").collection("service")
      
   
        // add get and fetch all data 
   
        app.get('/service',async(req,res)=>{
           const query ={}
           const cursor = serviceCollection.find(query)
           const service = await cursor.toArray()
           res.send(service)
        })
   
        //add get and fetch one data
   
        app.get('/service/:id',async(req,res)=>{
            const id = req.params.id;
            const query ={_id :ObjectId(id)}
            const service = await serviceCollection.findOne(query)
            res.send(service)
   
        })

        //use post api method
        app.post('/service',async(req,res)=>{
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService)
            res.send(result)
        })

        //use delete method api

        app.delete('/service/:id',async(req,res)=>{
            const id =req.params.id 
            const query = {_id:ObjectId(id)}
            const result = await serviceCollection.deleteOne(query)
            res.send(result)

        })
   
    }
    finally {
   
    }
   }
   
   run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send('server is working')

})

app.listen(port,()=>{
    console.log('listening to port',port);
})
