import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {ACCESS_TOKEN} from "../utils/token";

export const authorization = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.headers);
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res
            .status(401)
            .send('Unauthorized request')
    }

    try {
        const verified = jwt.verify(token, ACCESS_TOKEN);
        req.body.user = verified;
        next();
    } catch (err) {
        res
            .status(400)
            .send('Invalid token')
    }

}
