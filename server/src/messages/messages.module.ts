import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Project, User } from 'src/exports/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Project, User])],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule { }
