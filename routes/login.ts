import {Request, Response, Router} from "express";
import {UserRecord} from "../records/userRecord";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {verifyToken} from "../utils/verifyToken";


declare module 'express-session' {
    interface SessionData {
        user: UserRecord
    }
}


export const login = Router();


login
    .get('/', verifyToken, async (req: Request, res: Response) => {
        res.json({message: 'User is logged'});
    })
    .post('/', async (req, res, next) => {
        const {email, password} = req.body;
        const user = await UserRecord.getOne(email);

        if (!user) {
            next(res
                .status(400)
                .json({message: 'User not found'}));
        } else {
            const hashedPassword = user.password;
            const isValidPassword = await bcrypt.compare(password, hashedPassword);
            if (isValidPassword) {
                const {email, username} = user;
                const token = jwt.sign({email, username}, process.env.ACCESS_TOKEN as string, {expiresIn: '60m'})
                res
                    .cookie("access_token", token, {
                        httpOnly: true,
                    })
                    .status(200)
                    .json({email, username, token});
            } else {
                res
                    .status(400)
                    .json({message: 'Wrong password or username'})
            }
        }
    })
    .delete('/', async (req, res) => {
        res
            .status(204)
            .json({message: 'Logout'});
    });
