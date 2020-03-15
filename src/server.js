const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const withAuth= require('./middlewares/withAuth');

const handleRegister = require('./controllers/register');
const handleLogin = require('./controllers/login');
const getRestaurants = require('./controllers/restaurants');
const getRes =  require("./controllers/restaurant");
const search = require("./controllers/search");
const review =  require("./controllers/review");
const user =  require("./controllers/user");
const app = express();


app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 4000;
const url = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;

MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
    if (error)
        throw error;

    const db = client.db(dbName);

    app.get("/api", (req, res) => {
        res.send("hello!");
    })

    app.post("/api/register", (req, res) => {
        handleRegister(req, res, db);
    })

    app.post("/api/login", (req, res) => {
        handleLogin( req, res, db);
    })

    app.post("/api/test", withAuth, (req, res)=>{
        res.json(req.email);
    })

    app.get("/api/restaurants", (req, res)=>{
            getRestaurants(req, res, db);
    })

    app.post("/api/restaurant", (req, res)=>{
        getRes(req, res, db);
})

    app.post("/api/search", (req, res) => {
        search(req, res, db);
    })

    app.post("/api/review", withAuth, (req, res)=> {
        review(req, res, db);
    })

    app.get("/api/user", withAuth, (req, res)=>{
        user(req, res, db);
    })
    app.listen(port, () => {
        console.log(`app is running on port ${port}`);
    });
})

