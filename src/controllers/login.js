const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res, db) => {
    const { email: mail, password } = req.body;
    const email = mail.toLowerCase();
    if (!email || !password)
        return res.status(400).json({ error: "All fields are required" });

    const user = await db.collection("users").findOne({ email });

    if (!user)
        return res.status(400).json({ error: "Invalid email or password" });

    const isPasswordCorrect = await bcrypt.compare(password, user.hash);

    if (!isPasswordCorrect)
        return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({email},process.env.JWT_SECRET);

    
    return res.status(200).json({token});
    
    
}



module.exports = handleLogin;