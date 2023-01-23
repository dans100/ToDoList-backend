import {NextFunction, Request, Response} from "express";
import jwt, {JwtPayload, VerifyErrors} from "jsonwebtoken";


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res
            .status(401)
            .send({message: 'Unauthorized request'})
    }

    jwt.verify(token, process.env.ACCESS_TOKEN as string,
        (err: VerifyErrors | null, user: JwtPayload | string | undefined) => {
            if (err) return next(res.status(401).json({message: "Invalid token"}));
            // @ts-ignore
            req.user = user;
            next();
        });

}
