import {Request, Response, Router} from "express";
import {TaskRecord} from "../records/taskRecord";
import {ValidationError} from "../utils/error";
import {verifyToken} from "../utils/verifyToken";


export const list = Router();

list
    .get('/:name?', verifyToken, async (req: Request, res: Response) => {

        const list = await TaskRecord.listAll(req.user.id, req.params.name ?? '');
        res.json(list);
    })
    .post('/', verifyToken, async (req: Request, res: Response) => {

        const task = new TaskRecord({
            ...req.body,
            user_id: req.user.id,
        });
        await task.insert();
        res.json(task);
    })
    .delete('/:id?', verifyToken, async (req: Request, res: Response) => {
        if (req.params.id === 'complete') {
            await TaskRecord.deleteComplete(req.user.id);
            res.end();
        } else if (req.params.id) {
            const task = await TaskRecord.getOne(req.params.id);
            if (task === null) {
                return new ValidationError('Task not found');
            }
            await task.delete();
            res.json(task);
        } else {
            await TaskRecord.deleteAll(req.user.id);
            res.end();
        }
    })
    .patch('/:id', verifyToken, async (req, res) => {
        const task = await TaskRecord.getOne(req.params.id);
        if (task === null) {
            return new ValidationError('Task not found');
        }
        if (req.body.editTaskValue.length < 3 || req.body.editTaskValue.length > 55) {
            return new ValidationError('Task cannot be shorter than 3 characters and later than 55 characters');
        }
        task.description = req.body.editTaskValue;
        await task.update();
        res.json(task);
    })
    .patch('/:id/status', verifyToken, async (req, res) => {
        const task = await TaskRecord.getOne(req.params.id);
        if (task === null) {
            return new ValidationError('Task not found')
        }
        task.isCompleted = req.body.isComplete;
        await task.update();
        res.json(task);
    });


