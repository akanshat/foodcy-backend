const search =async (req, res, db) =>{
    const {query} = req.body;
    const name = new RegExp(query, 'i');
    const results = await db.collection("restaurants").find({name}).toArray();
    return res.status(200).json({results});
}

module.exports = search;