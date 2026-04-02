import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

import dotenv from "dotenv";
import { createWorks, deleteWorks, getAllWorks, updateWorks } from "../models/works.model";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!
});

export const fetchWorksService = async () => getAllWorks();

export const uploadWorkService = async (fileBuffer: Buffer, title: string, subtitle: string, description: string) => {
  const result: any = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder: "works" }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
  return createWorks(result.secure_url, title, subtitle, description);
};

export const updateWorkService = async (id: number, fileBuffer: Buffer, title: string, subtitle: string, description: string) => {
  const result: any = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder: "works" }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
  return updateWorks(id, result.secure_url, title, subtitle, description);
};

export const deleteWorksService = async (id: number) => deleteWorks(id);