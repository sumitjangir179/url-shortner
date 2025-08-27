import { eq } from "drizzle-orm";
import db from "../db/index.js";
import { userTable } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error('Unauthorized request');
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const [user] = await db.select().from(userTable).where(eq(userTable.id, decodedToken.id));

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