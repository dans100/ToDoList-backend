import {ErrorRequestHandler, Request, Response} from "express";

export class ValidationError extends Error {
}

export const handleError = (err: ErrorRequestHandler, req: Request, res: Response) => {

    console.error(err);

    res
        .status(err instanceof ValidationError ? 400 : 500)
        .json(err instanceof ValidationError ? err.message : 'Spróbuj ponownie później');
};


