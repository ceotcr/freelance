import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) { }

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const freelancer = await this.userRepository.findOneBy({ id: createInvoiceDto.freelancerId });
    if (!freelancer) {
      throw new NotFoundException('Freelancer not found');
    }

    const project = await this.projectRepository.findOneBy({ id: createInvoiceDto.projectId });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const invoice = this.invoiceRepository.create({
      amount: createInvoiceDto.amount,
      status: 'unpaid',
      issuedAt: new Date(),
      freelancer,
      project,
    });

    return await this.invoiceRepository.save(invoice);
  }

  async findByProject(projectId: number): Promise<Invoice[]> {
    return this.invoiceRepository.find({
      where: { project: { id: projectId } },
      relations: ['freelancer', 'project'],
    });
  }

  async findByFreelancer(freelancerId: number): Promise<Invoice[]> {
    return this.invoiceRepository.find({
      where: { freelancer: { id: freelancerId } },
      relations: ['freelancer', 'project'],
    });
  }

  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['freelancer', 'project'],
    });
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    return invoice;
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findOne(id);
    const updated = this.invoiceRepository.merge(invoice, updateInvoiceDto);
    return await this.invoiceRepository.save(updated);
  }

  async markAsPaid(id: number): Promise<Invoice> {
    return this.update(id, { status: 'paid' });
  }

  async remove(id: number): Promise<void> {
    const invoice = await this.findOne(id);
    await this.invoiceRepository.remove(invoice);
  }
}