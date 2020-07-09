import {Router} from 'express';
import {getManager} from 'typeorm';
import {Course} from './course_entity';
import {Lecturer} from '../lecturer/lecturer_entity';
const CourseController = Router();
CourseController.post('/:id', async (req, res) => {
  try {
    const course = new Course();
    const lecturerRepo = getManager().getRepository(Lecturer);
    const lecturer = await lecturerRepo.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (lecturer === undefined) {
      throw 'Lecturer does not exists';
    }
    course.CourseName = req.body.CourseName;
    course.CourseId = req.body.CourseId;
    course.lecturer = lecturer;
    const repo = getManager().getRepository(Course);
    await repo.save(course);
    res.sendStatus(201);
  } catch (error) {
    res.send(error);
  }
});
export {CourseController};
