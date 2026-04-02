import { Request, Response } from "express";
import { deleteWorksService, fetchWorksService, updateWorkService, uploadWorkService } from "../services/workService";
import { idSchema, parseWorkData } from "../validations/requestSchemas";


export const fetchWorksController = async (req: Request, res: Response) => {
    const works = await fetchWorksService();
    res.status(200).json(works);
};

export const uploadWorkController = async (req: any, res: Response) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    try {
        const parsed = parseWorkData(req.body.data);

        console.log(parsed)

        const work = await uploadWorkService(req.file.buffer, parsed.title, parsed.subtitle, parsed.description);
        res.status(201).json({ message: "Work uploaded", work });
    } catch (error: any) {
        if (error?.name === "SyntaxError") {
            return res.status(400).json({ message: "Invalid JSON in data field" });
        }

        if (error?.name === "ZodError") {
            return res.status(400).json({ message: "Invalid work payload", issues: error.issues });
        }

        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateWorkController = async (req: any, res: Response) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    try {
        const { id } = idSchema.parse(req.params);
        const parsed = parseWorkData(req.body.data);

        console.log(parsed)

        const updated = await updateWorkService(id, req.file.buffer, parsed.title, parsed.subtitle, parsed.description);
        res.status(200).json({ message: "Work updated", updated });
    } catch (error: any) {
        if (error?.name === "SyntaxError") {
            return res.status(400).json({ message: "Invalid JSON in data field" });
        }

        if (error?.name === "ZodError") {
            return res.status(400).json({ message: "Invalid work payload", issues: error.issues });
        }

        if (error?.message === "Work not found") {
            return res.status(404).json({ message: error.message });
        }

        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteWorkController = async (req: Request, res: Response) => {
    try {
        const { id } = idSchema.parse(req.params);
        await deleteWorksService(id);
        res.status(200).json({ message: "Work deleted" });
    } catch (error: any) {
        if (error?.name === "ZodError") {
            return res.status(400).json({ message: "Invalid work id", issues: error.issues });
        }

        if (error?.message === "Work not found") {
            return res.status(404).json({ message: error.message });
        }

        res.status(500).json({ message: "Internal server error" });
    }
};