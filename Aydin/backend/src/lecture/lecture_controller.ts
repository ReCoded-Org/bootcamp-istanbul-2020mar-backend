import {Router} from 'express';
import {getManager} from 'typeorm';
import {Course} from '../course/course_entity';
import {Lecture} from './lecture_entity';

import * as Joi from 'joi';
import * as Validator from 'express-joi-validation';

const validator = Validator.createValidator({});
const bodySchema = Joi.object({
  lectureName: Joi.string().required(),
  lectureDay: Joi.string().required(),
  lectureHour: Joi.string().required(),
});
const LectureController = Router();

LectureController.post(
  '/:courseid',
  validator.body(bodySchema),
  async (req, res) => {
    try {
      const lecture = new Lecture();
      const CourseRepo = getManager().getRepository(Course);
      const course = await CourseRepo.findOne({
        where: {
          CourseId: req.params.courseid,
        },
      });
      if (course === undefined) {
        throw 'The course does not exists';
      }
      lecture.lectureName = req.body.lectureName;
      lecture.lectureDay = req.body.lectureDay;
      lecture.lectureHour = req.body.lectureHour;
      lecture.course = course;
      const repo = getManager().getRepository(Lecture);
      await repo.save(lecture);
      res.sendStatus(201);
    } catch (error) {
      res.send(error);
    }
  }
);
export {LectureController};
