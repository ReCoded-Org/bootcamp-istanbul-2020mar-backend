import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {Course} from '../course/course_entity';
@Entity()
export class Lecturer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column('varchar', {length: 255})
  email: string;
  @Column()
  password: string;
  @OneToMany((type) => Course, (course) => course.lecturer)
  courses: Course[];
}
