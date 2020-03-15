const { ObjectID } = require('mongodb');

const review = async (req, res, db) => {
    const {email} = req;
    const {rating, content, resId} = req.body;
    if(!content || rating > "5" || rating < "1")
        return res.status(400).json({error: "Invalid Content."})

    const checkRes = await db.collection("restaurants").findOne({_id : ObjectID(resId)});
    if(!checkRes)
        return res.status(400).json({error: "Restaurant doesn't exist"});
    
    const { name } = await db.collection("users").findOne({email});
    
    await db.collection("reviews").insertOne({name, email, rating, content, resId: ObjectID(resId)});
    return  res.status(200).json({message: "Review posted successfully!"});
}

module.exports = review;