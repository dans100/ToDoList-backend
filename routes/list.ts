import {Router} from "express";
import {TaskRecord} from "../records/taskRecord";
import {ValidationError} from "../utils/error";


export const list = Router();

list
    .get('/', async (req, res) => {
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
            return new ValidationError('Nie znaleziono zadania o podanym id');
        }
        await task.delete();
        res.json(task);
    });
