import { db } from "../config/db";
import { Works } from "../interfaces/works.interface";


export const getAllWorks = async (): Promise<Works[]> => {
    const [rows]: any = await db.query("SELECT * FROM works ORDER BY created_at DESC");
    return rows;
};

export const createWorks = async (imageUrl: string, title: string, subtitle: string, description: string): Promise<Works> => {
    const [result]: any = await db.query(
        "INSERT INTO works (image_url, title, subtitle, description) VALUES (?, ?, ?, ?)",
        [imageUrl, title, subtitle, description]
    );
    return { id: result.insertId, image_url: imageUrl, title, subtitle, description };
};

export const updateWorks = async (id: number, imageUrl: string, title: string, subtitle: string, description: string): Promise<Works> => {
    const [result]: any = await db.query(
        "UPDATE works SET image_url = ?, title = ?, subtitle = ?, description = ? WHERE id = ?",
        [imageUrl, title, subtitle, description, id]
    );

    if (result.affectedRows === 0) {
        throw new Error("Work not found");
    }

    return { id, image_url: imageUrl, title, subtitle, description };
};

export const deleteWorks = async (id: number): Promise<void> => {
    const [result]: any = await db.query("DELETE FROM works WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
        throw new Error("Work not found");
    }
};