
export const pool = mysql.createPool({
    host: process.env.DBHOST as string,
    user: process.env.DBUSER as string,
    database: process.env.DATABASE as string,
    decimalNumbers: true,
    namedPlaceholders: true,
});

