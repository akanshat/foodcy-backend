import { ObjectId } from 'mongodb';


const getRes = async (req, res, db) => {
    const { id } = req.body;
    const rest = await db.collection("restaurants").findOne({ _id: new ObjectId(id) });
    const reviews = await db.collection("reviews").find({ resId: new ObjectId(id) }).toArray();

    return res.status(200).json({
        restaurant: {
            ...rest,
            reviews
        }
    });
}
export default getRes