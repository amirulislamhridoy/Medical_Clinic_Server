const express = require('express')
const app = express()
const port = process.env.PORT || 5000
var cors = require('cors')
var bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion } = require('mongodb');

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
    app.get('/department', async (req, res) => {
      const query = {}
      const cursor = departmentCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

  } finally {
    //   await client.close(); 
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  console.log('ok')
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})