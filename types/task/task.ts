import {TaskEntity} from "./task.entity";

export type TaskCreate = Omit<TaskEntity, 'id'>;
