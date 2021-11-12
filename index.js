const express = require('express')
const { MongoClient } = require('mongodb');
const app = express();
require('dotenv').config()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000

const uri = `mongodb+srv://CarSales:9iqpgI8rKCRUrpEc@cluster0.qp5s8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors())
app.use(express.json())


async function run(){
    try{
      await client.connect()
      const database=client.db('Car-sales')
      const carCollection = database.collection("carInfo")
      const myCollection = database.collection('myorderinfo')
      const reviewCollection= database.collection('review')

      app.post('/addproduct',async(req,res)=>{
        const product = req.body;
        const result = await carCollection.insertOne(product)
        console.log(result)
        res.json(result)
      })

      app.post('/review',async(req,res)=>{
        const product = req.body;
        const result = await reviewCollection.insertOne(product)
        console.log(result)
        res.json(result)
      })


      app.post('/placeorder',async(req,res)=>{
        const order=req.body;
        
        const result =await myCollection.insertOne(order)
        console.log(result)
        res.json(result)
      })

      app.get('/myorder',async(req,res)=>{
        const email = req.query.email;
        const query = {email:email}
        const cursor =await myCollection.find(query)
        const myorder = await cursor.toArray();
        res.json(myorder)
      })


      app.get('/explore',async(req,res)=>{
        const cursor = carCollection.find({});
        const car = await cursor.toArray(); 
        res.json(car)
      })

      app.get('/review',async(req,res)=>{
        const cursor = reviewCollection.find({});
        const car = await cursor.toArray(); 
        res.json(car)
      })

      
    app.get('/purchase/:id',async(req,res)=>{
      const id = req.params.id;
      console.log('getting',id)
      const query = {_id:ObjectId(id)}
      const product = await carCollection.findOne(query);
      res.json(product);
    })
    //  delete
  app.delete("/deletorder/:id", async (req, res) => {
    console.log(req.params.id);
    const result = await myCollection.deleteOne({
      _id: ObjectId(req.params.id),
    });
    res.send(result);
  });

    }
    finally {
      // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('car sales')
  })
   
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
  