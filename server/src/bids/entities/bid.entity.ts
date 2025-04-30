import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Bid {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal')
    amount: number;

    @Column('text')
    proposal: string;

    @Column({ type: 'enum', enum: ['pending', 'accepted', 'rejected'], default: 'pending' })
    status: 'pending' | 'accepted' | 'rejected';

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ManyToOne(() => User, user => user.bids)
    freelancer: User;

    @ManyToOne(() => Project, project => project.bids)
    project: Project;
}
