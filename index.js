const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')

const app = express()
const port = process.env.PORT || 5000

const ObjectId = require('mongodb').ObjectId
app.use(cors())
app.use(express.json())

require ('dotenv').config()

// niche-product-website
// oVTaUS1ZmNP5Ih7O

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qlklf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const run = async() =>{
     try{
          await client.connect()
          console.log("database connected")

          const database = client.db("niche-product")
          const productsCollection = database.collection("products")
          const userCollection = database.collection("user-cart")

          //get products
          app.get('/products',async (req,res)=>{
               console.log(req.query)
               const cursor =  productsCollection.find({})
               const page = req.query.page
               const size = parseInt(req.query.size)
               let result;
               if(page){
                    result = await cursor.limit(size).toArray()
               }
               else{
                    result = await cursor.toArray()
               }          
               res.json(result)
          })

          // post users information
          app.post('/users',async(req,res) => {
               console.log(req.body)
               const doc = await userCollection.insertOne(req.body)
               res.json(doc)
          })

          // get only signed in users
          app.get('/users/:id',async(req,res)=>{
               const query = {email: req.params.id}
               const cursor = await userCollection.find(query)
               const result = await cursor.toArray()
               console.log(result)
               res.json(result)
          })


          // delete operation by user
          app.delete('/users/:id',async(req,res)=>{
               console.log(req.params.id)
               const query = {_id:ObjectId(req.params.id)}
               const result = await userCollection.deleteOne(query)  
               res.json(result)
          })

          // get all the users
          app.get('/users', async(req,res)=>{
               const cursor = await userCollection.find({})
               const result = await cursor.toArray()
               res.json(result)
          })


          app.get('/', async(req,res) =>{
               console.log("server running")
               res.send('Server Running')
          })
          app.listen(port,() =>{
               console.log("listening from port",port)
          })

     }
     finally{
               // await client.close();
     }

}
run().catch(console.dir);











