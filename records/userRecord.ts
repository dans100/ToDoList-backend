import { ValidationError } from '../utils/error';
import { pool } from '../utils/db';
import { FieldPacket } from 'mysql2';
import { v4 as uuid } from 'uuid';
import { UserEntity } from '../types';

type ResUserRecords = [UserRecord[], FieldPacket[]];

export class UserRecord implements UserEntity {
  id?: string;
  username: string;
  pwd: string;
  email: string;

  constructor(obj: UserEntity) {
    if (!obj.username || !obj.pwd || !obj.email) {
      throw new ValidationError(
        'Please enter a valid email, username and password (non-empty values).'
      );
    }

    if (obj.username.length > 55 || obj.username.length < 3) {
      throw new ValidationError(
        'User name cannot be shorter than 3 characters and later than 55 characters'
      );
    }

    if (obj.pwd.length > 60 || obj.pwd.length < 7) {
      throw new ValidationError(
        'Password cannot be shorter than 7 characters and later than 60 characters'
      );
    }
    if (!obj.email.includes('@')) {
      throw new ValidationError('Email should contain character @');
    }

    this.id = obj.id;
    this.username = obj.username;
    this.pwd = obj.pwd;
    this.email = obj.email;
  }

  public async insert(): Promise<string> {
    if (!this.id) {
      this.id = uuid();
    }

    await pool.execute(
      'INSERT INTO `users` VALUES(:id, :pwd, :password, :email)',
      {
        id: this.id,
        username: this.username,
        pwd: this.pwd,
        email: this.email,
      }
    );
    return this.id;
  }

  public static async getOne(email: string): Promise<UserRecord | null> {
    const [result] = (await pool.execute(
      'SELECT * FROM `users` WHERE `email`=:email',
      {
        email,
      }
    )) as ResUserRecords;

    return result.length === 0 ? null : new UserRecord(result[0]);
  }
}
