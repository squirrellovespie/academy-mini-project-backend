import { ZodSchema } from "zod";
import { RequestHandler } from "express";

export function validateParams(schema: ZodSchema): RequestHandler {
    return (req, res, next) => {
        const result = schema.safeParse(req.params);
        if (!result.success) {
            res.status(400).json({
                errors: result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
            return;
        }
        next();
    };
}

export function validateBody(schema: ZodSchema): RequestHandler {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                errors: result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }
        next();
    };
}

export function validateQuery(schema: ZodSchema): RequestHandler {
    return (req, res, next) => {
        const result = schema.safeParse(req.query);
        if (!result.success) {
            return res.status(400).json({
                errors: result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }
        next();
    };
}
