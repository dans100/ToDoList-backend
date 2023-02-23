import {Router} from "express";
import bcrypt from "bcrypt";
import {UserRecord} from "../records/userRecord";

export const register = Router();

register
    .post('/', async (req, res) => {
        const {username, password, email} = req.body;
        if (await UserRecord.getOne(email) === null) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserRecord({
                username,
                password: hashedPassword,
                email,
            });
            await newUser.insert();
            res
                .status(201)
                .json({message: `User ${username} has been registered`});
        } else {
            res
                .status(409)
                .json({message: `User ${username} is already`});
        }
    })
