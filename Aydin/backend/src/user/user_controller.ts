import { Router } from 'express';
import { getManager } from 'typeorm';
import { User } from './user_entitiy';

const UserController = Router();

UserController.post('/', async (req, res) => {
	const user = new User();
	user.firstName = req.body.firstName;
	user.lastName = req.body.lastName;
	user.age = req.body.age;
	const repo = getManager().getRepository(User);
	await repo.save(user);

	res.sendStatus(201);
});

UserController.get('/', async (req, res) => {
	const repo = getManager().getRepository(User);
	const users = await repo.find();
	res.json(users);
});

export { UserController };
