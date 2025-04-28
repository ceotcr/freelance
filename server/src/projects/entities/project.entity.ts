import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { Message } from 'src/messages/entities/message.entity';
import { Milestone } from 'src/milestones/entities/milestone.entity';
import { Bid } from 'src/bids/entities/bid.entity';
import { UploadedFile } from 'src/files/entities/file.entity';

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column({ type: 'decimal' })
    budget: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    postedAt: Date;

    @ManyToOne(() => User, user => user.projects)
    client: User;

    @OneToMany(() => Bid, bid => bid.project)
    bids: Bid[];

    @OneToMany(() => Milestone, milestone => milestone.project)
    milestones: Milestone[];

    @OneToMany(() => Message, message => message.project)
    messages: Message[];

    @OneToMany(() => UploadedFile, file => file.project)
    files: UploadedFile[];

    @OneToMany(() => Invoice, invoice => invoice.project)
    invoices: Invoice[];
}
