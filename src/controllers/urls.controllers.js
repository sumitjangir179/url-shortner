import { nanoid } from "nanoid";
import { urlTable } from "../models/urls.model.js";
import db from "../db/index.js";
import { shortenPostRequestBodySchema } from "../validations/request.validation.js";
import { and, eq } from "drizzle-orm";

const shortUrl = async (req, res) => {
    try {
        const validationResult = await shortenPostRequestBodySchema.safeParseAsync(req.body);

        if (validationResult.error) {
            return res.status(400).json({ message: 'Invalid request data', errors: validationResult.error.format() });
        }

        const { url, code } = validationResult.data;
        const shortCode = code ?? nanoid(6)

        const [result] = await db.insert(urlTable).values({ shortCode, targetUrl: url, userId: req.user.id }).returning({ id: urlTable.id, shortCode: urlTable.shortCode, targetUrl: urlTable.targetUrl });

        return res.status(201).json(result);

    } catch (error) {
        console.error('Error creating short URL:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const getAllUrls = async (req, res) => {
    try {
        const urls = await db.select().from(urlTable).where(eq(urlTable.userId, req.user.id));
        return res.status(200).json(urls);

    } catch (error) {
        console.error('Error fetching URLs:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteUrl = async (req, res) => {
    try {
        const { id } = req.params
        await db.delete(urlTable).where(and(eq(urlTable.id, id), eq(urlTable.userId, req.user.id)))
        return res.status(200).json({ message: 'URL deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const shortCode = async (req, res) => {
    try {
        const { shortCode: code } = req.params

        const [targetUrl] = await db.select({ targetUrl: urlTable.targetUrl }).from(urlTable).where(eq(urlTable.shortCode, code));

        if (!targetUrl) {
            return res.status(404).json({ message: 'URL not found' });
        }

        return res.redirect(targetUrl.targetUrl);

    } catch (error) {
        console.error('Error creating short URL:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export { shortUrl, shortCode, getAllUrls, deleteUrl };