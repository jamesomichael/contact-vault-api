import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Document } from 'mongoose';

export interface TokenPayload extends JwtPayload {
	user: {
		id: string;
	};
}

export interface AuthorisedRequest extends Request {
	user: {
		id: string;
	};
}

export interface UserDto {
	id: string;
	name: string;
	email: string;
	createdAt: number;
}

export interface UserDocument extends Document {
	name: string;
	email: string;
	password: string;
	createdAt: number;
}

export interface UserSession {
	token: string;
	user: UserDto;
}
