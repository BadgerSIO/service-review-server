const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
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
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    const servicesCollection = client.db("precisionLaw").collection("sevices");
  } finally {
  }
}
run().catch((err) => console.log(err));
