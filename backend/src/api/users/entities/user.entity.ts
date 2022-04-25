import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from '../interfaces/user.interface';

@Entity("user")
export class UserEntity implements User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    address: string;

    @Column()
    nonce: string;

    @Column({ nullable: true })
    email: string | null;

    @Column()
    joined: string;

    @Column()
    updated_at: string;

    @Column({ nullable: true })
    deleted_at: string | null;

    @Column({ nullable: true })
    role: string | null;
}
