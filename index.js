const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { query } = require("express");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Precision law server running");
});

app.listen(port, () => {
  console.log(`precision law server is running on port: ${port}`);
});

const uri = `mongodb+srv://${process.env.PLAW_DBUSER}:${process.env.PLAW_DBPASS}@cluster0.gqpfnmn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    const servicesCollection = client.db("precisionLaw").collection("sevices");
    const blogsCollection = client.db("precisionLaw").collection("blogs");

    app.get("/blogs", async (req, res) => {
      const query = {};
      const cursor = blogsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/lastServices", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query).limit(3);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/allServices", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/addService", async (req, res) => {
      const newService = req.body;
      const result = await servicesCollection.insertOne(newService);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));
