const user = async (req, res, db) => {
    const {email} =  req;

    const result = await db.collection("users").findOne({email});

    return res.status(200).json({user: result});
}

module.exports = user;