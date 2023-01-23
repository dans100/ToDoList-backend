import {Router} from "express";
import {verifyToken} from "../utils/verifyToken";

export const admin = Router();

admin
    .get('/', verifyToken, (req, res) => {
        res.send('Welcome to admin page');
    });
