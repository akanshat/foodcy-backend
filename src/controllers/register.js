const bcrypt = require('bcrypt');

const handleRegister = async (req, res, db) => {
    const { name, email: mail, password } = req.body;
    const email = mail.toLowerCase();

    if (!name || !email || !password)
        return res.status(400).json({ error: "All fields are required" });

    const checkUser = await db.collection("users").findOne({ email });
    if (checkUser) res.status(400).json({ error: "email already exists" });

    else {
        const hash = await bcrypt.hash(password, 10);
        await db.collection("users").insertOne({
            name,
            email,
            hash
        });
        res.status(200).json({ message: "Registered Successfully!" });
    }
}

module.exports = handleRegister;