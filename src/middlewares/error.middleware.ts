import { NextFunction, Request, Response } from 'express';
import { HttpException } from './http.exception'

const notFound = (req: Request, res: Response, next: NextFunction) => {
    next(new HttpException(`Not Found - ${req.url || req.originalUrl}`, 404));
};

const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    // console.error(err);
    // const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // res.status(statusCode).json({
    //     message: err.message,
    //     stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    // });

    try {
        console.error(error);
        const status: number = error.status || 500;
        let message: string = error.message || 'Something went wrong';
        if (error.name === 'SequelizeUniqueConstraintError') message = error?.errors?.map((err: any) => err.message).join('; ');

        console.log(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);

        res.status(status).json({ message });
        // res.status(status).json({ message, stack: process.env.NODE_ENV === 'production' ? undefined : error.stack });
    } catch (error) {
        next(error);
    }
};

export { errorHandler, notFound };
