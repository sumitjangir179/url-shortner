import db from "../db/index.js";
import { userTable } from "../models/user.model.js";
import { eq } from "drizzle-orm";
import { createHmac, randomBytes } from "node:crypto"
import { signupPostRequestBodySchema } from "../validations/request.validation.js";

const signUp = async (req, res) => {
    try {
        const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body);

        if (validationResult.error) {
            return res.status(400).json({ message: 'Invalid request data', errors: validationResult.error.format() });
        }

        const { name, email, password } = validationResult.data;

        const [existingUser] = await db.select().from(userTable).where(eq(userTable.email, email));

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = randomBytes(16).toString('hex');
        const hashPassword = createHmac('sha256', salt).update(password).digest('hex');

        const [newUser] = await db.insert(userTable).values({ name, email, password: hashPassword, salt }).returning({ id : userTable.id });

        res.status(201).json({ message: 'User created successfully', newUser });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { signUp };