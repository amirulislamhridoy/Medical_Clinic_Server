const express = require('express')
const app = express()
const port = process.env.PORT || 5000
var cors = require('cors')
var bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion } = require('mongodb');
var {ObjectId} = require('mongodb'); 
var jwt = require('jsonwebtoken');
require('dotenv').config()

app.use(cors())
// app.use(bodyParser.json())
app.use(express.json())

const uri = "mongodb+srv://medical_clinic:32202910@cluster0.n2etiah.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

async function run() {
  try {
    const departmentCollection = client.db("medical-clinick").collection("department");
    const bookCollection = client.db("medical-clinick").collection("book");
    const userCollection = client.db("medical-clinick").collection("user");
    app.get('/department', async (req, res) => {
      const query = {}
      const cursor = departmentCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/allAppointments', async (req, res) => {
      const today = req.query.today
      const query = {date: today}
      const allResult = await bookCollection.find({}).toArray()
      const todayAllResult = await bookCollection.find(query).toArray()
      res.send({allResult, todayAllResult})
    })
    app.get('/user/:email', async (req, res) => {
      const email = req.params.email
      const query = {email}
      const result = await userCollection.findOne(query)
      const isAdmin = result?.role === 'admin'
      res.send(isAdmin)
    })
    app.get('/user', async (req, res) => {
      const query = {}
      const result = await userCollection.find(query).toArray()
      res.send(result)
    })

    // post 
    app.post('/book', async (req, res) => {
      const data = req.body
      const result = await bookCollection.insertOne(data)
      res.send(result)
    })

    // patch
    app.patch('/login/:email',async (req, res) => {
      const email = req.params.email
      const filter = {email}
      const options = {upsert: true}
      const updateDoc = {
        $set: {email}
      }
      const result = await userCollection.updateOne(filter, updateDoc, options)

      const token = jwt.sign({email}, process.env.SYCRECT_CODE, {expiresIn: '1h'})
      res.json(token)
    })

    // put
    app.put('/makeAdmin', async (req, res) => {
      const id = req.query.id
      console.log(id)
      const filter = {_id: ObjectId(id)}
      const updateDoc = {
        $set: {role: 'admin'}
      }
      const result = await userCollection.updateOne(filter, updateDoc)
      res.send(result)
    })

    // delete
    app.delete('/appointment/:id', async (req, res) => {
      const id = req.params.id
      const filter = {_id: ObjectId(id)}
      const result = await bookCollection.deleteOne(filter)
      res.send(result)
    })

  } finally {
    //   await client.close(); 
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// add