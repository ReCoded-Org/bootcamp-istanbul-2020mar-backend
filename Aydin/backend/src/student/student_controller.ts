import {Router} from 'express';
import {getManager} from 'typeorm';
import {Student} from './student_entity';
import {Lecture} from '../lecture/lecture_entity';
import {Course} from '../course/course_entity';
import * as Joi from 'joi';
import * as Validator from 'express-joi-validation';

const validator = Validator.createValidator({});

const bodySchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  studentId: Joi.number().integer().required(),
});

const StudentController = Router();

StudentController.post('/', validator.body(bodySchema), async (req, res) => {
  try {
    const student = new Student();
    student.first_name = req.body.firstName;
    student.last_name = req.body.lastName;
    student.email = req.body.email;
    student.password = req.body.password;
    student.student_id = req.body.studentId;
    const studentRepo = getManager().getRepository(Student);
    await studentRepo.save(student);
    res.sendStatus(201);
  } catch (error) {
    res.send(error);
  }
});
/* Here i had to check 4 things:

  1-if the student exists
  2-if the student exists check if his info are correct (email,password,SID) 
  3-if the student is registered in the course
  4-if the lecture the student is trying to sign in belongs to the same course that the student is 
  registered in.
*/
StudentController.post('/:courseid/:lecturename', async (req, res) => {
  try {
    const studentEmail = req.body.studentEmail;
    const studentPassword = req.body.studentPassword;
    const studentId = req.body.studentId;
    const lectureName = req.params.lecturename;
    const lectureRepo = getManager().getRepository(Lecture);
    const courseRepo = getManager().getRepository(Course);
    const studentRepo = getManager().getRepository(Student);
    const student = await studentRepo.findOne({
      where: {
        student_id: studentId,
        email: studentEmail,
        password: studentPassword,
      },
    });
    console.log(student);
    if (student === undefined) {
      throw new Error(
        'Your email/password did not match. For more details contact your lecturer'
      );
    }
    const course = await courseRepo.findOne({
      where: {
        course_id: req.params.courseid,
      },
      relations: ['students'],
    });
    console.log(course);
    if (course === undefined) {
      throw new Error('This course does not exists');
    }
    const registeredStudentInCourse = course.students.find(
      (student) => student.student_id == studentId
    );
    if (registeredStudentInCourse === undefined) {
      throw new Error('You are not registered in this Course');
    }
    const lecture = await lectureRepo
      .createQueryBuilder('lecture')
      .leftJoinAndSelect('lecture.students', 'student')
      .where('lecture.course.course_id = :courseId', {
        courseId: req.params.courseid,
      })
      .andWhere('lecture.lecture_name = :name', {name: lectureName})
      .getOne();
    console.log(lecture);
    if (lecture === undefined) {
      throw new Error('This lecture does not exist');
    }
    if (
      student !== undefined &&
      course !== undefined &&
      registeredStudentInCourse !== undefined &&
      lecture !== undefined
    ) {
      lecture.students.push(student);
      await lectureRepo.save(lecture);
      res.sendStatus(200);
    }
  } catch (error) {
    res.send(error);
  }
});

export {StudentController};
