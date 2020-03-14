const getRestaurants = async (req, res, db) => {
    const restaurants = await db.collection("restaurants").find({}).toArray();

    return res.status(200).json({restaurants});
}

module.exports = getRestaurants;