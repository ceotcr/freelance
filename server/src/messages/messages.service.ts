import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) { }

  async create(createMessageDto: CreateMessageDto, senderId: number): Promise<Message> {
    const { content, projectId } = createMessageDto;

    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['client', 'assignedTo'],
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const message = this.messageRepository.create({
      content,
      sender: { id: senderId },
      project: { id: projectId },
    });

    return this.messageRepository.save(message);
  }

  async findAllByProject(projectId: number, userId: number): Promise<Message[]> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['client', 'assignedTo'],
    });

    if (!project) {
      throw new Error('Project not found');
    }

    if (project.client.id !== userId && project.assignedTo?.id !== userId) {
      throw new Error('Unauthorized access to messages');
    }

    return this.messageRepository.find({
      where: { project: { id: projectId } },
      relations: ['sender', 'project'],
      order: { sentAt: 'ASC' },
    });
  }
}