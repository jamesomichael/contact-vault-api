import { RequestHandler } from 'express';

import {
	userExists,
	getToken,
	logInUser,
	createUser,
} from '../models/auth.model';

const register: RequestHandler = async (req, res): Promise<void> => {
	const { email, name, password } = req.body;
	console.log(
		`[authController: register] Attempting to register user ${email}...`
	);

	try {
		if (await userExists(email)) {
			console.log('[authController: register]: User already exists.');
			res.status(409).json({ message: 'User already exists.' });
			return;
		}

		const user = await createUser(name, email, password);
		const token = getToken(user.id);
		res.status(200).json({ token, user });
	} catch (error: any) {
		console.error(`[authController: register] ${error.message}`);
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

const login: RequestHandler = async (req, res): Promise<void> => {
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
				res.status(401).json({ message: error.message });
				return;
			}
			res.status(500).json({ message: 'Something went wrong.' });
			return;
		}

		const token = getToken(user.id);
		res.status(200).json({ token, user });
	} catch (error: any) {
		console.error(`[authController: login] ${error.message}`);
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

export default { register, login };
