import { db } from "../../config/db";
import ApiError from "../../errors/ApiError";
import { Works } from "../interfaces/works.interface";
import httpStatus from 'http-status';
import { ResultSetHeader, RowDataPacket } from "mysql2";




export const getAllWorks = async (): Promise<Works[]> => {
    const [rows] = await db.query<(Works & RowDataPacket)[]>("SELECT * FROM works ORDER BY created_at DESC");
    return rows;
};

export const getWorkById = async (id: number): Promise<Works | null> => {
    const [rows] = await db.query<(Works & RowDataPacket)[]>("SELECT * FROM works WHERE id = ?", [id]);
    return rows[0] ?? null;
};

export const createWorks = async (
    imageUrl: string,
    title: string,
    subtitle: string,
    description: string
): Promise<Works> => {
    const [result] = await db.query<ResultSetHeader>(
        "INSERT INTO works (image_url, title, subtitle, description) VALUES (?, ?, ?, ?)",
        [imageUrl, title, subtitle, description]
    );
    return { id: result.insertId, image_url: imageUrl, title, subtitle, description };
};

export const updateWorks = async (
    id: number,
    imageUrl: string | undefined,
    title: string | undefined,
    subtitle: string | undefined,
    description: string | undefined
): Promise<Works> => {
    const existing = await getWorkById(id);
    if (!existing) {
        throw new ApiError(httpStatus.NOT_FOUND, "Work not found");
    }

    const nextImageUrl = imageUrl ?? existing.image_url;
    const nextTitle = title ?? existing.title;
    const nextSubtitle = subtitle ?? existing.subtitle;
    const nextDescription = description ?? existing.description;

    const [result] = await db.query<ResultSetHeader>(
        "UPDATE works SET image_url = ?, title = ?, subtitle = ?, description = ? WHERE id = ?",
        [nextImageUrl, nextTitle, nextSubtitle, nextDescription, id]
    );

    if (result.affectedRows === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "Work not found");
    }

    return {
        id,
        image_url: nextImageUrl,
        title: nextTitle,
        subtitle: nextSubtitle,
        description: nextDescription,
    };
};

export const deleteWorks = async (id: number): Promise<void> => {
    const [result] = await db.query<ResultSetHeader>("DELETE FROM works WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "Work not found");
    }
};