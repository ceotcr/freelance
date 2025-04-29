import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) { }

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const message = new Message();
    message.content = createMessageDto.content;
    message.sender = { id: createMessageDto.senderId } as User;
    message.project = { id: createMessageDto.projectId } as Project;

    return this.messageRepository.save(message);
  }

  findAll(): Promise<Message[]> {
    return this.messageRepository.find({ relations: ['sender', 'project'] });
  }

  async findOne(id: number): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['sender', 'project'],
    });
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }

  async update(id: number, updateMessageDto: UpdateMessageDto): Promise<Message> {
    await this.messageRepository.update(id, {
      ...updateMessageDto,
    });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.messageRepository.delete(id);
  }
}
