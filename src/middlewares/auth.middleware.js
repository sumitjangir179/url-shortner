import db from "../db/index.js";
import { userTable } from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error('Unauthorized request');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await db.select().from(userTable).where({ id: decoded.id });

        if (!user) {
            throw new Error('Unauthorized request');
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({ message: error.message || 'Internal server error' });
    }
}

export default verifyJWT;