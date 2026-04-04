import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const createWorkSchema = z.object({
    title: z.string().trim().min(1, "Title is required"),
    subtitle: z.string().trim().min(1, "Subtitle is required"),
    description: z.string().trim().min(1, "Description is required"),
});

export const updateWorkSchema = createWorkSchema.partial();

const workBodySchema = z.object({
    data: z
        .string()
        .trim()
        .min(1, "Data is required")
        .refine(
            (value) => {
                try {
                    JSON.parse(value);
                    return true;
                } catch {
                    return false;
                }
            },
            { message: "Data must be valid JSON" }
        ),
});

export const createWorkRequestSchema = z.object({
    data: workBodySchema.shape.data,
});

export const updateWorkRequestSchema = z.object({
    data: workBodySchema.shape.data,
});

const parseWorkData = <T extends z.ZodTypeAny>(schema: T, data: unknown): z.infer<T> => {
    const parsedData = typeof data === "string" ? JSON.parse(data) : data;
    return schema.parse(parsedData);
};

export const parseCreateWorkData = (data: unknown) => {
    return parseWorkData(createWorkSchema, data);
};

export const parseUpdateWorkData = (data: unknown) => {
    return parseWorkData(updateWorkSchema, data);
};

export const idSchema = z.object({
    id: z.coerce.number().int().positive(),
});