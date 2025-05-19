import { Note } from "src/notes/entities/note.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({unique: true})
    email: string;

    @Column()
    state: string;

    @Column({default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @OneToMany(() => Note, (note) => note.user, {cascade: true})
    notes: Note[];
}
