import { Request, Response } from 'express';

import User from '../db/models/User';
import {
	userExists,
	getToken,
	generateHashedPassword,
	logInUser,
} from '../models/auth.model';

const register = async (req: Request, res: Response) => {
	const { email, name, password } = req.body;
	console.log(
		`[authController: register] Attempting to register user ${email}...`
	);

	try {
		if (await userExists(email)) {
			console.log('[authController: register]: User already exists.');
			return res.status(409).json({ message: 'User already exists.' });
		}

		const hashedPassword = await generateHashedPassword(password);

		console.log('[authController: register] Storing user in database...');
		const user = new User({ name, email, password: hashedPassword });
		await user.save();
		console.log('[authController: register] User saved.');

		const token = getToken(user.id);
		res.status(200).json({
			token,
			user: { id: user.id, name: user.name, email: user.email },
		});
	} catch (error: any) {
		console.error(`[authController: register] ${error.message}`);
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	console.log(
		`[authController: login] Attempting to log in user ${email}...`
	);

	try {
		let user;
		try {
			user = await logInUser(email, password);
		} catch (error: any) {
			if (/Invalid credentials/.test(error.message)) {
				return res.status(401).json({ message: error.message });
			}
			return res.status(500).json({ message: 'Something went wrong.' });
		}

		const token = getToken(user.id);
		res.status(200).json({
			token,
			user: { id: user.id, name: user.name, email: user.email },
		});
	} catch (error: any) {
		console.error(`[authController: login] ${error.message}`);
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

export default { register, login };
