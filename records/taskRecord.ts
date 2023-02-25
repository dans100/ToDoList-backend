import {TaskEntity} from "../types";
import {ValidationError} from "../utils/error";
import {v4 as uuid} from 'uuid';
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";

type ResListRecord = [TaskEntity[], FieldPacket[]];

export class TaskRecord implements TaskEntity {

    id?: string;
    description: string;
    user_id: string;
    isCompleted: number;

    constructor(public obj: TaskEntity) {

        if (!obj.description || obj.description.length < 3 || obj.description.length > 55) {
            throw new ValidationError('Description cannot be shorter than 3 characters and later than 55 characters');
        }

        this.id = obj.id;
        this.description = obj.description;
        this.user_id = obj.user_id;
        this.isCompleted = obj.isCompleted;
    }

    public async insert(): Promise<void> {
        if (!this.id) {
            this.id = uuid();
        }
        await pool.execute('INSERT INTO `tasks` VALUES(:id, :description, :user_id, :isCompleted)', {
            id: this.id,
            description: this.description,
            user_id: this.user_id,
            isCompleted: 0,
        })
    }

    public async delete(): Promise<void> {
        await pool.execute('DELETE FROM `tasks` WHERE `id`=:id', {
            id: this.id,
        });
    }

    public async update(): Promise<void> {
        await pool.execute('UPDATE `tasks` SET `description`=:description, `isCompleted`=:isCompleted WHERE `id`=:id', {
            id: this.id,
            description: this.description,
            isCompleted: this.isCompleted,
        })
    }

    public static async getOne(id: string): Promise<TaskRecord | null> {
        const [result] = await pool.execute('SELECT * FROM `tasks` WHERE `id`=:id', {
            id,
        }) as ResListRecord;
        return result.length === 0 ? null : new TaskRecord(result[0]);
    }

    public static async listAll(userId: string, name: string): Promise<TaskEntity[]> {
        const [result] = await pool.execute('SELECT * FROM `tasks` WHERE `user_id`=:user_id AND `description` LIKE :search', {
            search: `%${name}%`,
            user_id: userId,
        }) as ResListRecord;
        // return result.map(obj => new TaskRecord(obj));
        return result;
    }

    public static async deleteAll(userId: string): Promise<void> {
        await pool.execute('DELETE FROM `tasks` WHERE `user_id`=:user_id', {
            user_id: userId,
        });
    }

    public static async deleteComplete(userId: string): Promise<void> {
        await pool.execute('DELETE FROM `tasks` WHERE `user_id`=:user_id AND `isCompleted`=:isCompleted', {
            user_id: userId,
            isCompleted: 1,
        });
    }

}
