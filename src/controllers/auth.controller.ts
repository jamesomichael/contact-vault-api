import { RequestHandler } from 'express';

import { userExists, logInUser, registerUser } from '../models/auth.model';

const register: RequestHandler = async (req, res): Promise<void> => {
	const { email, name, password } = req.body;
	try {
		console.log(
			`[authController: register] Attempting to register user ${email}...`
		);
		if (await userExists(email)) {
			console.log('[authController: register]: User already exists.');
			res.status(409).json({ message: 'User already exists.' });
			return;
		}

		const { user, token } = await registerUser(name, email, password);
		res.status(200).json({ token, user });
	} catch (error: any) {
		console.error(`[authController: register] ${error.message}`);
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

const login: RequestHandler = async (req, res): Promise<void> => {
	const { email, password } = req.body;
	try {
		console.log(
			`[authController: login] Attempting to log in user ${email}...`
		);
		const { user, token } = await logInUser(email, password);
		res.status(200).json({ token, user });
	} catch (error: any) {
		console.error(`[authController: login] ${error.message}`);
		if (/Invalid credentials/.test(error.message)) {
			res.status(401).json({ message: error.message });
			return;
		}
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

export default { register, login };
