// import { z } from "zod";

// export const loginSchema = z.object({
//     email: z.string().email(),
//     password: z.string().min(6),
// });

// export const workSchema = z.object({
//     title: z.string().trim().min(1, "Title is required"),
//     subtitle: z.string().trim().min(1, "Subtitle is required"),
//     description: z.string().trim().min(1, "Description is required"),
// });

// export const parseWorkData = (data: unknown) => {
//     const parsedData = typeof data === "string" ? JSON.parse(data) : data;

//     return workSchema.parse(parsedData);
// };

// export const idSchema = z.object({
//     id: z.coerce.number().int().positive(),
// });


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

export const parseCreateWorkData = (data: unknown) => {
    const parsedData = typeof data === "string" ? JSON.parse(data) : data;
    return createWorkSchema.parse(parsedData);
};

export const parseUpdateWorkData = (data: unknown) => {
    const parsedData = typeof data === "string" ? JSON.parse(data) : data;
    return updateWorkSchema.parse(parsedData);
};

export const idSchema = z.object({
    id: z.coerce.number().int().positive(),
});