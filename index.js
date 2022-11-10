const express = require("express");
const cors = require("cors");
var jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const reviewCollection = client.db("precisionLaw").collection("reviews");

    app.get("/blogs", async (req, res) => {
      const query = {};
      const cursor = blogsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/lastServices", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query).sort({ _id: -1 }).limit(3);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/allServices", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/sdetail/:id", async (req, res) => {
      let reqId = req.params.id;
      const query = {
        _id: ObjectId(reqId),
      };
      const result = await servicesCollection.findOne(query);
      res.send(result);
    });
    app.get("/singleReview/:id", async (req, res) => {
      let reqId = req.params.id;
      const query = {
        _id: ObjectId(reqId),
      };
      const result = await reviewCollection.findOne(query);
      res.send(result);
    });
    app.get("/getReviews", async (req, res) => {
      const query = {
        serviceId: `${req.query.serviceId}`,
      };
      const cursor = reviewCollection.find(query).sort({ date: -1 });
      const results = await cursor.toArray();

      res.send(results);
    });
    app.get("/myReviews", async (req, res) => {
      const query = {
        author: req.query.email,
      };
      const cursor = reviewCollection.find(query);
      const results = await cursor.toArray();
      res.send(results);
    });
    app.get("/allReviews", async (req, res) => {
      const query = {};
      const cursor = reviewCollection.find(query).limit(3);
      const results = await cursor.toArray();
      res.send(results);
    });

    app.post("/addService", async (req, res) => {
      const newService = req.body;
      const result = await servicesCollection.insertOne(newService);
      res.send(result);
    });
    app.post("/addReview", async (req, res) => {
      const newReview = req.body;

      const result = await reviewCollection.insertOne(newReview);
      res.send(result);
    });

    app.patch("/updateReview/:id", async (req, res) => {
      const revid = req.params.id;
      const updateRev = req.body;
      console.log(updateRev.reviewtxt);
      const query = {
        _id: ObjectId(revid),
      };
      const updateDoc = {
        $set: {
          reviewtxt: updateRev.reviewtxt,
        },
      };
      const result = await reviewCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    app.delete("/deleteReview/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));
