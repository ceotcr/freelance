import { Project } from 'src/projects/entities/project.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
export enum MilestoneStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    APPROVED = 'approved',
    PAID = 'paid',
}

@Entity()
export class Milestone {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    dueDate: Date;

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

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;
}
