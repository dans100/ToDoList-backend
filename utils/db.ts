const mysql = require('mysql2/promise');

export const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'todo_list',
    decimalNumbers: true,
    namedPlaceholders: true,
});
