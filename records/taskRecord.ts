import {TaskEntity} from "../types";
import {ValidationError} from "../utils/error";
import {v4 as uuid} from 'uuid';
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";

type ResListRecord = [TaskEntity[], FieldPacket[]]

export class TaskRecord implements TaskEntity {

    id?: string;
    task: string;

    constructor(public obj: TaskEntity) {

        if (!obj.task || obj.task.length < 3 || obj.task.length > 250) {
            throw new ValidationError('Liczba znaków musi być większa od 3 i mniejsza od 250');
        }

        this.id = obj.id;
        this.task = obj.task;
    }

    public async insert(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        }
        await pool.execute('INSERT INTO `list` VALUES(:id, :task)', {
            id: this.id,
            task: this.task,
        })
        return this.id;
    }

    public async delete(): Promise<void> {
        await pool.execute('DELETE FROM `list` WHERE `id`=:id', {
            id: this.id,
        });
    }

    public static async getOne(id: string): Promise<TaskRecord | null> {
        const [result] = await pool.execute('SELECT * FROM `list` WHERE `id`=:id', {
            id,
        }) as ResListRecord;
        return result.length === 0 ? null : new TaskRecord(result[0]);
    }

    public static async listAll(): Promise<TaskEntity[]> {
        const [result] = await pool.execute('SELECT * FROM `list`') as ResListRecord;
        // return result.map(obj => new TaskRecord(obj));
        return result;
    }

}
