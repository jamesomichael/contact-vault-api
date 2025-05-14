import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

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
