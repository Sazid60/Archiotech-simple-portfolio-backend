
import { Request, Response } from "express";
import httpStatus from "http-status";
import {
    deleteWorksService,
    fetchWorksService,
    updateWorkService,
    uploadWorkService,
} from "../services/workService";
import {
    idSchema,
    parseCreateWorkData,
    parseUpdateWorkData,
} from "../validations/requestSchemas";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";


export const fetchWorksController = catchAsync(async (req: Request, res: Response) => {
    const works = await fetchWorksService();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Works fetched successfully",
        data: works,
    });
});

export const uploadWorkController = catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
        res.status(httpStatus.BAD_REQUEST).json({ message: "No file uploaded" });
        return;
    }
    const parsed = parseCreateWorkData(req.body.data);

    const work = await uploadWorkService(
        req.file.buffer,
        parsed.title,
        parsed.subtitle,
        parsed.description
    );

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Work uploaded",
        data: work,
    });
});

export const updateWorkController = catchAsync(async (req: any, res: Response) => {
    const { id } = idSchema.parse(req.params);
    const parsed = parseUpdateWorkData(req.body.data);

    const updated = await updateWorkService(
        id,
        req.file?.buffer,
        parsed.title,
        parsed.subtitle,
        parsed.description
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Work updated",
        data: updated,
    });
});

export const deleteWorkController = catchAsync(async (req: Request, res: Response) => {
    const { id } = idSchema.parse(req.params);
    await deleteWorksService(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Work deleted",
        data: null,
    });
});