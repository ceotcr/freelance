import { Project } from 'src/projects/entities/project.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
export enum MilestoneStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    APPROVED = 'approved',
}

@Entity()
export class Milestone {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('decimal')
    amount: number;

    @Column({
        type: 'enum',
        enum: MilestoneStatus,
        default: MilestoneStatus.PENDING,
    })
    status: MilestoneStatus;

    @ManyToOne(() => Project, project => project.milestones)
    project: Project;
}
