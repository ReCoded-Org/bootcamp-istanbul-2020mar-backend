import {Entity, Column, PrimaryColumn, ManyToMany, JoinTable} from 'typeorm';
import {Course} from '../course/course_entity';
@Entity()
export class Student {
  @PrimaryColumn()
  studentId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column('varchar', {unique: true, length: 255})
  email: string;
  @Column()
  password: string;

 
}
