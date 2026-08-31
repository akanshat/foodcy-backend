import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';

const url = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;

const client = new MongoClient(url, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

const restaurantTypes = ["Bistro", "Grill", "Tavern", "Kitchen", "Diner", "Pizzeria", "Cafe", "Lounge", "House", "Garden"];
const dishPool = [
    { dishname: "Truffle Burger", dishprice: 16.99 }, { dishname: "Margherita Pizza", dishprice: 14.50 },
    { dishname: "Avocado Toast", dishprice: 11.25 }, { dishname: "Spicy Ramen", dishprice: 15.99 },
    { dishname: "Salmon Nigiri", dishprice: 18.00 }, { dishname: "Garlic Parmesan Wings", dishprice: 12.99 },
    { dishname: "Caesar Salad", dishprice: 10.50 }, { dishname: "Fettuccine Alfredo", dishprice: 17.25 }
];

// Seed arrays
const restaurantsMockData = [];
const reviewsMockData = [];

// Step 1: Pre-assemble the 50 restaurant layouts without reviews embedded inside them
for (let i = 0; i < 50; i++) {
    const type = restaurantTypes[i % restaurantTypes.length];
    const dish1 = dishPool[(i * 2) % dishPool.length];
    const dish2 = dishPool[(i * 2 + 1) % dishPool.length];

    restaurantsMockData.push({
        name: `The Golden ${type} #${i + 1}`,
        address: `${100 + i} Culinary Boulevard, Sector ${i + 1}`,
        rating: parseFloat((3.8 + Math.random() * 1.1).toFixed(1)),
        imageUrl: `https://loremflickr.com/240/225/dessert?random=${i}`,
        latitude: 40.7128 + (i * 0.005),
        longitude: -74.0060 - (i * 0.005),
        menu: [
            { dishname: dish1.dishname, dishprice: dish1.dishprice },
            { dishname: dish2.dishname, dishprice: dish2.dishprice }
        ]
        // Note: No reviews field here anymore, they live in their own collection now!
    });
}

async function run() {
    try {
        await client.connect();
        const db = client.db(dbName);

        const restaurantCollection = db.collection('restaurants');
        const reviewCollection = db.collection('reviews');

        // Wipe both collections to ensure clean data transitions
        await restaurantCollection.deleteMany({});
        await reviewCollection.deleteMany({});

        // Insert the restaurants first
        const restResult = await restaurantCollection.insertMany(restaurantsMockData);
        console.log(`\n🎉 Step 1: Inserted ${restResult.insertedCount} unique restaurants into 'restaurants' collection.`);

        // Step 2: Extract the generated object IDs and build corresponding reviews
        // restResult.insertedIds is an object where key is index and value is the real MongoDB ObjectId
        const insertedIdsArray = Object.values(restResult.insertedIds);

        insertedIdsArray.forEach((id, index) => {
            // Generate a couple of mock reviews for every restaurant ID
            reviewsMockData.push({
                resId: id, // Relational connection matching your exact restaurant _id
                author: `GourmetGuy_${index}`,
                rating: Math.floor(Math.random() * 2) + 4, // Scores of 4 or 5
                comment: `The menu items from restaurant #${index + 1} were served perfectly hot and seasoned well!`
            });

            reviewsMockData.push({
                resId: id,
                author: `CritiqueQueen_${index}`,
                rating: Math.floor(Math.random() * 3) + 3, // Scores of 3, 4, or 5
                comment: `Decent ambiance. Tried the menu items here and would likely return for a casual dinner.`
            });
        });

        // Insert the linked reviews into their own separate collection
        const reviewResult = await reviewCollection.insertMany(reviewsMockData);
        console.log(`🎉 Step 2: Inserted ${reviewResult.insertedCount} cross-referenced reviews into 'reviews' collection.`);

    } catch (error) {
        console.error("❌ Data seeding execution failed:", error);
    } finally {
        await client.close();
    }
}

run();
