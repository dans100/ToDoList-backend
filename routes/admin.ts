import {Router} from "express";
import {authorization} from "./authorization";

export const admin = Router();

admin
    .get('/', authorization, (req, res) => {
        res.send('Welcome to admin page');
    });
