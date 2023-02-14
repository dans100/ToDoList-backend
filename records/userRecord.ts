import {ValidationError} from "../utils/error";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";


type ResUserRecords = [UserRecord[], FieldPacket[]];

export class UserRecord {

    username: string;
    password: string;
    email: string;

    constructor(obj: {username: string, password: string, email: string}) {

        if(!obj.username || !obj.password || !obj.email) {
            throw new ValidationError('Wymagane jest uzupełnienie wszystkich wartości')
        }

        if(obj.username.length > 55 || obj.username.length < 3) {
            throw new ValidationError('Liczba znaków w nazwie użytkownika musi być mniejsza od 55 i większa od 3');
        }

        if(obj.password.length > 60 || obj.password.length < 7) {
            throw new ValidationError('Liczba znaków w haśle użytkownika musi być mniejsza od 60 i większa od 7');
        }
        if(!obj.email.includes('@')) {
            throw new ValidationError('Adres email musi zawierać znak specjalny @');
        }


        this.username = obj.username;
        this.password = obj.password;
        this.email = obj.email;


    }

    public async insert():Promise<string> {

        await pool.execute('INSERT INTO `users` VALUES(:username, :password, :email, :refreshToken)', {
            username: this.username,
            password: this.password,
            email: this.email,
            refreshToken: null,

        })
        return this.username;
    }

    public static async getOne(email:string):Promise<UserRecord | null> {
        const [result] = await pool.execute('SELECT * FROM `users` WHERE `email`=:email', {
            email,
        }) as ResUserRecords;

        return result.length === 0 ? null : new UserRecord(result[0]);

    }

}
