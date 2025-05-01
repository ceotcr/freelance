import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Post()
  create(
    @Body() createMessageDto: CreateMessageDto,
    @GetUser() user: User,
  ) {
    return this.messagesService.create(createMessageDto, user.id);
  }

  @Get('project/:projectId')
  findAllByProject(
    @Param('projectId') projectId: string,
    @GetUser() user: User,
  ) {
    return this.messagesService.findAllByProject(parseInt(projectId), user.id);
  }
}