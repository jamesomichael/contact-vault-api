import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';

import { AuthorisedRequest, TokenPayload } from './types/auth';

const JWT_SECRET: string = process.env.JWT_SECRET!;

const auth: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const token: string | undefined = req
		.header('Authorization')
		?.split('Bearer ')[1];

	if (!token) {
		res.status(401).json({ message: 'An access token is required.' });
		return;
	}

	try {
		const data = jwt.verify(token, JWT_SECRET) as TokenPayload;
		(req as AuthorisedRequest).user = { id: data.user.id };
		next();
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			res.status(401).json({ message: 'Access token has expired.' });
			return;
		}
		res.status(401).json({ message: 'Invalid access token provided.' });
		return;
	}
};

export { auth };
