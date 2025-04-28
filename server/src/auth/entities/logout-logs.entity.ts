import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

@Entity()
export class LogoutLog {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, { eager: true })
    user: User;

    @Column()
    logoutTime: Date;

    @Column()
    ipAddress: string;

    @Column()
    userAgent: string;
}