import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import {Course} from '../course/course_entity';
import {Student} from '../student/student_entity';
@Entity()
export class Lecture {
  @PrimaryColumn()
  lectureName: string;

  @Column({nullable: false})
  lectureDay: string;
  @Column({nullable: false})
  lectureHour: string;
  @ManyToOne((type) => Course, (course) => course.lectures)
  course: Course;
  @ManyToMany((type) => Student)
  @JoinTable()
  students: Student[];
}
