const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')

const app = express()
const port = process.env.PORT || 5000

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