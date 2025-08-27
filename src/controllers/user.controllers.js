import db from "../db/index.js";
import { userTable } from "../models/user.model.js";
import { signupPostRequestBodySchema, signinPostRequestBodySchema } from "../validations/request.validation.js";
import { hashPasswordWithSalt } from "../utils/hash.js";
import { getUserByEmail } from "../services/user.service.js";
import jwt from "jsonwebtoken";

const signUp = async (req, res) => {
    try {
        const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body);

        if (validationResult.error) {
            return res.status(400).json({ message: 'Invalid request data', errors: validationResult.error.format() });
        }

        const { name, email, password } = validationResult.data;

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const { hashPassword, salt } = hashPasswordWithSalt(password);

        const [newUser] = await db.insert(userTable).values({ name, email, password: hashPassword, salt }).returning({ id: userTable.id });

        res.status(201).json({ message: 'User created successfully', newUser });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

const signIn = async (req, res) => {
    try {
        const validationResult = await signinPostRequestBodySchema.safeParseAsync(req.body);

        if (validationResult.error) {
            return res.status(400).json({ message: 'Invalid request data', errors: validationResult.error.format() });
        }
        const { email, password } = validationResult.data;

        const existingUser = await getUserByEmail(email);

        if (!existingUser) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const { hashPassword } = hashPasswordWithSalt(password, existingUser.salt);

        if (hashPassword !== existingUser.password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const accessToken = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        const option = { httpOnly: true, secure: process.env.NODE_ENV === 'production' };
        
        delete existingUser.password;
        delete existingUser.salt;
        
        res.status(200).cookie('accessToken', accessToken, option).json({ message: 'User signed in successfully', accessToken, user: existingUser });

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

export { signUp, signIn };