import {Router} from "express";
import {TaskRecord} from "../records/taskRecord";
import {ValidationError} from "../utils/error";
import {verifyToken} from "../utils/verifyToken";


export const list = Router();

list
    .get('/', verifyToken, async (req, res) => {
        const list = await TaskRecord.listAll();
        res.json(list);
    })
    .post('/', async (req, res) => {
        const task = new TaskRecord(req.body);
        await task.insert();
        res.json(task);
    })
    .delete('/:id', async(req, res) => {
        const task = await TaskRecord.getOne(req.params.id);
        if (task === null) {
            return new ValidationError('User not found');
        }
        await task.delete();
        res.json(task);
    });
