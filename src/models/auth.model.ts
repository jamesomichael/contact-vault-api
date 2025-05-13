import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import User from '../db/models/User';

const JWT_SECRET: string = process.env.JWT_SECRET!;

const userExists = (email: string) => User.findOne({ email }).lean();

const getUser = (email: string) => User.findOne({ email });

const getToken = (userId: string) => {
	const payload = {
		user: {
			id: userId,
		},
	};
	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
	return token;
};

const logInUser = async (email: string, password: string) => {
	const user = await getUser(email);
	if (!user) {
		throw new Error('Invalid credentials.');
	}

	const isValid = await bcrypt.compare(password, user.password);
	if (!isValid) {
		throw new Error('Invalid credentials.');
	}

	return user;
};

const generateHashedPassword = async (password: string) => {
	const salt = await bcrypt.genSalt(12);
	const hashedPassword = await bcrypt.hash(password, salt);
	return hashedPassword;
};

export { userExists, getUser, getToken, logInUser, generateHashedPassword };
