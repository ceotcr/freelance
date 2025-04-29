import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';

@Entity()
@Unique(['user', 'userAgent', 'ipAddress'])
export class LogoutLog {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { eager: true })
    user: User;

    @Column()
    logoutTime: Date;

    @Column()
    ipAddress: string;

    @Column()
    userAgent: string;
}