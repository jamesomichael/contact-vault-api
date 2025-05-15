import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import User from '../db/models/User';

import { UserDto, UserSession, UserDocument } from '../types/auth';

const JWT_SECRET: string = process.env.JWT_SECRET!;

const userExists = (email: string): Promise<Partial<UserDocument> | null> =>
	User.findOne({ email }).lean();

const getUserDocument = (email: string): Promise<UserDocument | null> =>
	User.findOne({ email });

const formatUserData = ({
	id,
	name,
	email,
	createdAt,
}: UserDocument): UserDto => ({
	id,
	name,
	email,
	createdAt,
});

const getToken = (userId: string): string => {
	const payload = {
		user: {
			id: userId,
		},
	};
	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
	return token;
};

const logInUser = async (
	email: string,
	password: string
): Promise<UserSession> => {
	const userDocument = await getUserDocument(email);
	if (!userDocument) {
		console.error(`[authModel: logInUser] No user found.`);
		throw new Error('Invalid credentials.');
	}

	const isValid = await bcrypt.compare(password, userDocument.password);
	if (!isValid) {
		console.error(`[authModel: logInUser] Invalid credentials provided.`);
		throw new Error('Invalid credentials.');
	}

	const user = formatUserData(userDocument);
	const token = getToken(user.id);
	return { token, user };
};

const generateHashedPassword = async (password: string): Promise<string> => {
	const salt = await bcrypt.genSalt(12);
	const hashedPassword = await bcrypt.hash(password, salt);
	return hashedPassword;
};

const registerUser = async (
	name: string,
	email: string,
	password: string
): Promise<UserSession> => {
	try {
		const hashedPassword = await generateHashedPassword(password);
		console.log('[authModel: createUser] Storing user in database...');
		const userDocument: UserDocument = new User({
			name,
			email,
			password: hashedPassword,
		});
		await userDocument.save();
		console.log('[authModel: createUser] User saved.');
		const user = formatUserData(userDocument);
		const token = getToken(user.id);
		return { token, user };
	} catch (error: any) {
		console.error(`[authModel: createUser] ${error.message}`);
		throw error;
	}
};

export { userExists, logInUser, registerUser };
