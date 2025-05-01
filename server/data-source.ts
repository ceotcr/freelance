import { DataSource } from "typeorm";
import { User, Project, Bid, Milestone, Skill, Invoice, Message, LogoutLog, UploadedFile } from "./src/exports/entities";
import 'dotenv/config';
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        User,
        Project,
        Bid,
        Milestone,
        Skill,
        Invoice,
        UploadedFile,
        Message,
        LogoutLog,
    ],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
});
