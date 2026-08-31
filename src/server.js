import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';
import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors'

import withAuth from './middlewares/withAuth.js'
import handleRegister from './controllers/register.js';
import handleLogin from './controllers/login.js';
import getRestaurants from './controllers/restaurants.js';
import getRes from './controllers/restaurant.js';
import search from './controllers/search.js';
import review from './controllers/review.js';
import user from './controllers/user.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 4000;
const url = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;

const client = new MongoClient(url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

let db;

async function connectDB() {
    try {
        await client.connect();

        await client.db('admin').command({ ping: 1 });
        console.log('Pinged your deployment. You successfully connected to MongoDB!');

        db = client.db(dbName);

    } catch (error) {
        console.error("Failed to initialize database instance:", error);
        throw error;
    }
}

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`app is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    });


app.use((req, res, next) => {
    if (!db) {
        return res.status(500).json({ error: "Database not initialized yet." });
    }
    next();
});

app.get("/api", (req, res) => {
    res.send("hello!");
})

app.post("/api/register", (req, res) => {
    handleRegister(req, res, db);
})

app.post("/api/login", (req, res) => {
    handleLogin(req, res, db);
})

app.post("/api/test", withAuth, (req, res) => {
    res.json(req.email);
})

app.get("/api/restaurants", (req, res) => {
    getRestaurants(req, res, db);
})

app.post("/api/restaurant", (req, res) => {
    getRes(req, res, db);
})

app.post("/api/search", (req, res) => {
    search(req, res, db);
})

app.post("/api/review", withAuth, (req, res) => {
    review(req, res, db);
})

app.get("/api/user", withAuth, (req, res) => {
    user(req, res, db);
})
