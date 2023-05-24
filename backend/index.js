
// For backend and express
const express = require('express');
// To connect with your mongoDB database
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/', {
    dbName: 'sports',
    useNewUrlParser: true,
    useUnifiedTopology: true
});
 
// Schema for users of app
const TeamsSchema = new mongoose.Schema({
    Rk: {
        type: String,
        required: true,
    },
    Franchise: {
        type: String,
        required: true,
        unique: true,
    },
    From: {
        type: Number,
        required: true,
    },
    To: {
      type: Number,
      required: true,
    },
    W: {
      type: Number,
      required: true,
    },
    L: {
      type: Number,
      required: true,
    },
});

const Teams = mongoose.model('teams', TeamsSchema);
Teams.createIndexes();

const app = express();
const cors = require("cors");
console.log("App listen at port 5000");

app.use(express.json());
app.use(cors());

app.get("/", async (req, resp) => {
  const res = await Teams.find()
  console.log(res)

  resp.send(res);
  // You can check backend is working or not by
  // entering http://loacalhost:5000
   
  // If you see App is working means
  // backend working properly
});

app.listen(5000);