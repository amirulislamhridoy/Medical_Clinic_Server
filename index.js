const express = require('express')
const app = express()
const port = process.env.PORT || 5000

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://medical_clinic:32202910@cluster0.n2etiah.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
// a
async function run() {
    const departmentCollection = client.db("medical-clinick").collection("department");
    try {
        app.get('/git ', async (req, res) => {
            const cursor = departmentCollection.find({})
            const result = await cursor.toArray()
            console.log(result)
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