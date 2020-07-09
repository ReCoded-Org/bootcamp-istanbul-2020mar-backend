import {Router} from 'express';
import {getManager, getConnection} from 'typeorm';
import {Lecturer} from './lecturer_entity';
import {Course} from '../course/course_entity';
import {Student} from '../student/student_entity';
import * as Joi from 'joi';
import * as Validator from 'express-joi-validation';

const validator = Validator.createValidator({});
const bodySchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const LecturerController = Router();
LecturerController.post('/', validator.body(bodySchema), async (req, res) => {
  try {
    const lecturer = new Lecturer();
    lecturer.firstName = req.body.firstName;
    lecturer.lastName = req.body.lastName;
    lecturer.email = req.body.email;
    lecturer.password = req.body.password;
    const repo = getManager().getRepository(Lecturer);
    await repo.save(lecturer);

    res.sendStatus(201);
  } catch (error) {
    res.send(error);
  }
});
LecturerController.put('/course', async (req, res) => {
  try {
    const courseRepo = getManager().getRepository(Course);
    const studentRepo = getManager().getRepository(Student);
    const course = await courseRepo.findOne({
      where: {
        CourseId: req.query.courseId,
      },
      relations: ['students'],
    });
    if (course === undefined) {
      throw 'Course does not exists';
    }
    const student = await studentRepo.findOne({
      where: {
        studentId: req.body.studentId,
      },
    });
    if (student === undefined) {
      throw 'Student does not exists';
    }
    course.students = [student];
    await courseRepo.save(course);
    res.sendStatus(200);
  } catch (error) {
    res.send(error);
  }
});
export {LecturerController};
