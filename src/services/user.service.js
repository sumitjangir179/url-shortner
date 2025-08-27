import db from "../db.js";
import { userTable } from "../models/user.model.js";
import { eq } from "drizzle-orm";

const getUserByEmail = async (email) => {
    const [existingUser] = await db.select().from(userTable).where(eq(userTable.email, email));
    return existingUser;
}

export { getUserByEmail };