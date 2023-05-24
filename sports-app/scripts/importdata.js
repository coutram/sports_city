const csvtojson = require("csvtojson");

const { MongoClient, ServerApiVersion } = require("mongodb");
// Replace the placeholder with your Atlas connection string
const uri = "mongodb://localhost:27017";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);



getData = async () => { 
  return await csvtojson().fromFile("data/MLB_TEAM.csv")
}

run = async() => {

  const data = await getData()

  console.log(data)

  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    const myDB = await client.db("sports");
    const myColl = await myDB.collection("teams");

    // insert the data to the db
    await myColl.insertMany(data)
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}


run().catch(console.dir);





