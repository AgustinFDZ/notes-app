import 'dotenv/config';

export const envs = {
    port: process.env.PORT,

    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbUsername: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,

    jwtSecret: process.env.JWT_SECRET,

    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
}