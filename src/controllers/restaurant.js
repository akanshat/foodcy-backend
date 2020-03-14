const { ObjectID } = require('mongodb');

const getRes = async (req, res, db) => {
    const { id } = req.body;
    const rest = await db.collection("restaurants").findOne({ _id: ObjectID(id) });
    const reviews = await db.collection("reviews").find({ restaurantId: ObjectID(id) }).toArray();
    
    return res.status(200).json({
        restaurant: {
            ...rest,
            reviews
        }
    });
}

module.exports = getRes;