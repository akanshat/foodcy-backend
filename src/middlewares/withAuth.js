import jwt from 'jsonwebtoken'
const secret = process.env.JWT_SECRET;

const withAuth = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token)
        return res.status(401).json({ error: "Unauthorized" });



    try {
        const decoded = jwt.verify(token, secret);
        req.email = decoded.email;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: "Unauthorized" });
    }
}

export default withAuth