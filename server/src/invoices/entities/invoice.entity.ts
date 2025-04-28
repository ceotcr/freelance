import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Invoice {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal')
    amount: number;

    @Column()
    status: string; // unpaid, paid, overdue

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    issuedAt: Date;

    @ManyToOne(() => User, user => user.invoices)
    freelancer: User;

    @ManyToOne(() => Project, project => project.invoices)
    project: Project;
}
