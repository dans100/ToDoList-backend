import {Router} from "express";
import {UserRecord} from "../records/userRecord";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {ACCESS_TOKEN} from "../utils/token";

export const login = Router();


login
    .post('/', async (req, res) => {
        const {username, email, password} = req.body;
        const user = await UserRecord.getOne(email);

        if (!user) {
            res
                .status(401)
                .send('User not found')
        } else {
            const hashedPassword = user.password;
            const isValidPassword = await bcrypt.compare(password, hashedPassword);
            if (isValidPassword) {
                const token = jwt.sign({username, email}, ACCESS_TOKEN, {expiresIn: '15m'});
                const refreshToken = jwt.sign({username, email}, ACCESS_TOKEN);
                await user.updateRefreshToken(refreshToken);
                res.json({token, refreshToken});
            } else {
                res
                    .status(401)
            }
        }
    })
