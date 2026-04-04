
import {
    createWorks,
    deleteWorks,
    getAllWorks,
    getWorkById,
    updateWorks,
} from "../models/works.model";
import {
    deleteImageFromCloudinary,
    safeDeleteImageFromCloudinary,
    uploadBufferToCloudinary,
} from "../config/cloudinary.config";

export const fetchWorksService = async () => getAllWorks();

export const uploadWorkService = async (
    fileBuffer: Buffer,
    title: string,
    subtitle: string,
    description: string
) => {
    const result = await uploadBufferToCloudinary(fileBuffer, "works");

    return createWorks(result.secure_url, title, subtitle, description);
};

export const updateWorkService = async (
    id: number,
    fileBuffer: Buffer | undefined,
    title: string | undefined,
    subtitle: string | undefined,
    description: string | undefined
) => {
    const existing = await getWorkById(id);
    if (!existing) {
        throw new Error("Work not found");
    }

    let imageUrl: string | undefined;
    let uploadedImageUrl: string | undefined;

    if (fileBuffer) {
        const result = await uploadBufferToCloudinary(fileBuffer, "works");
        imageUrl = result.secure_url;
        uploadedImageUrl = result.secure_url;
    }

    try {
        const updated = await updateWorks(id, imageUrl, title, subtitle, description);

        if (uploadedImageUrl) {
            await deleteImageFromCloudinary(existing.image_url);
        }

        return updated;
    } catch (err) {
        if (uploadedImageUrl) {
            await safeDeleteImageFromCloudinary(uploadedImageUrl);
        }

        throw err;
    }
};

export const deleteWorksService = async (id: number) => {
    const existing = await getWorkById(id);
    if (!existing) {
        throw new Error("Work not found");
    }

    await deleteWorks(id);
    await deleteImageFromCloudinary(existing.image_url);
};