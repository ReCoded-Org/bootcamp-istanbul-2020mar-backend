import {Router} from 'express';
import {getManager, getConnection, getRepository} from 'typeorm';
import {Lecturer} from './lecturer_entity';
import {Course} from '../course/course_entity';
import {Student} from '../student/student_entity';
import * as Joi from 'joi';
import * as Validator from 'express-joi-validation';
import {Lecture} from '../lecture/lecture_entity';
import * as json2csv from 'json2csv';

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
    lecturer.first_name = req.body.firstName;
    lecturer.last_name = req.body.lastName;
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
        course_id: req.query.courseId,
      },
      relations: ['students'],
    });
    if (course === undefined) {
      throw new Error('Course does not exists');
    }
    const student = await studentRepo.findOne({
      where: {
        student_id: req.body.studentId,
      },
    });
    if (student === undefined) {
      throw 'Student does not exists';
    }
    course.students.push(student);
    await courseRepo.save(course);
    res.sendStatus(200);
  } catch (error) {
    res.send(error);
  }
});

LecturerController.get('/lecture', async (req, res) => {
  try {
    const lectureRepo = getManager().getRepository(Lecture);
    const lectureName = req.query.lecturename;
    const lecture = await lectureRepo.findOne({
      where: {
        lecture_name: lectureName,
      },
      relations: ['students'],
    });
    if (lecture === undefined) {
      throw new Error(`Could not find a lecture with name  ${lectureName}`);
    }
    if (lecture.students.length === 0) {
      throw new Error('there was no students in this lecture');
    }

    const listOfStudents = lecture.students.map((student) => {
      const studentObject = {
        firstName: student.first_name,
        lastName: student.last_name,
        SID: student.student_id,
        email: student.email,
      };
      return studentObject;
    });
    const json2csvParse = new json2csv.Parser();
    const csv = json2csvParse.parse(listOfStudents);
    res.set('Content-Disposition', 'attachment;filename=myfilename.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.send(error);
  }
});

LecturerController.get('/course', async (req, res) => {
  try {
    const courseRepo = getManager().getRepository(Course);
    const lectureRepo = getManager().getRepository(Lecture);
    const courseId = req.query.courseid;
    const course = await courseRepo.findOne({
      where: {
        course_id: courseId,
      },
      relations: ['lectures'],
    });
    console.log(course);
    if (course === undefined) {
      throw new Error(`Could not find a lecture with an ID: ${courseId}`);
    }
    if (course.lectures.length === 0) {
      throw new Error('there was no students in this lecture');
    }
    const attendanceList = await lectureRepo
      .createQueryBuilder('lecture')
      .leftJoinAndSelect('lecture.students', 'student')
      .select(['lecture.lecture_name', 'student.student_id'])
      .where('lecture.course.course_id = :courseId', {courseId: courseId})
      .getMany();
    console.log(attendanceList);

    res.send(attendanceList);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

LecturerController.get('/:courseid/student', async (req, res) => {
  try {
    const lectureRepo = getManager().getRepository(Lecture);
    const courseId = req.params.courseid;
    const studentId = req.query.studentid;
    const attendanceList = await lectureRepo
      .createQueryBuilder('lecture')
      .leftJoinAndSelect('lecture.students', 'student')
      .where('lecture.course.course_id = :courseId', {courseId: courseId})
      .andWhere('student.student_id = :studentId', {studentId: studentId})
      .getMany();
    res.send(attendanceList);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

export {LecturerController};
