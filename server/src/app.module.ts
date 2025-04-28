import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule, BidsModule, FilesModule, InvoicesModule, MessagesModule, MilestonesModule, ProjectsModule, SkillsModule, UsersModule } from './exports/modules';
import { Bid, Invoice, LogoutLog, Message, Milestone, Project, Skill, User, UploadedFile } from './exports/entities';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfig } from './common/config/multer.config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['.env.development.local', '.env.development', '.env'],
  }), TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Project, Bid, Milestone, Skill, Invoice, UploadedFile, Message, LogoutLog],
    synchronize: true,
  }), MulterModule.registerAsync({
    useClass: MulterConfig
  }), UsersModule, ProjectsModule, BidsModule, MilestonesModule, SkillsModule, InvoicesModule, FilesModule, MessagesModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
