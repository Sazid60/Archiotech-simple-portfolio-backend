import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import ApiError from "../errors/ApiError";
import httpStatus from "http-status";



cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
	api_key: process.env.CLOUDINARY_API_KEY as string,
	api_secret:process.env.CLOUDINARY_API_SECRET as string,
});

export const uploadBufferToCloudinary = async (fileBuffer: Buffer, folder = "works") => {
	try {
		const result: any = await new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{ folder, resource_type: "image" },
				(error, uploaded) => {
					if (error) reject(error);
					else resolve(uploaded);
				}
			);

			Readable.from(fileBuffer).pipe(uploadStream);
		});

		return result;
	} catch (error) {
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cloudinary upload failed", error);
	}
};

const extractCloudinaryPublicId = (imageUrl: string): string | null => {
	try {
		const parsedUrl = new URL(imageUrl);
		const marker = "/upload/";
		const markerIndex = parsedUrl.pathname.indexOf(marker);

		if (markerIndex === -1) {
			return null;
		}

		const assetPath = parsedUrl.pathname.slice(markerIndex + marker.length);
		const parts = assetPath.split("/").filter(Boolean);
		const pathWithoutVersion = parts[0]?.match(/^v\d+$/) ? parts.slice(1) : parts;
		const fullPath = pathWithoutVersion.join("/");

		return fullPath.replace(/\.[^/.]+$/, "");
	} catch {
		return null;
	}
};

export const deleteImageFromCloudinary = async (imageUrl?: string) => {
	if (!imageUrl) {
		return;
	}

	const publicId = extractCloudinaryPublicId(imageUrl);
	if (!publicId) {
		return;
	}

	try {
		const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image" });

		if (result.result !== "ok") {
			throw new ApiError(
				httpStatus.INTERNAL_SERVER_ERROR,
				`Cloudinary image deletion was not successful: ${result.result}`,
				result
			);
		}
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}

		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cloudinary image deletion failed", error);
	}
};

export const safeDeleteImageFromCloudinary = async (imageUrl?: string) => {
	try {
		await deleteImageFromCloudinary(imageUrl);
	} catch (error) {
		console.warn("Cloudinary safe delete failed", {
			imageUrl,
			error,
		});
	}
};


export default cloudinary;
