export const environment = {
    secretKey: "bvgv2UP1RagVbVqpRTME",
    database: {
        "host": "db",
        "port": process.env.MYSQL_PORT,
        "username": process.env.MYSQL_USER,
        "password": process.env.MYSQL_PASSWORD,
        "database": process.env.MYSQL_DATABASE,
        "synchronize": true
    }
};
