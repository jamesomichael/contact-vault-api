import { NextFunction, Request, Response } from 'express';
import authController from '../../src/controllers/auth.controller';
import * as authModel from '../../src/models/auth.model';

jest.mock('../../src/models/auth.model');
jest.mock('../../src/db/models/User');

describe('auth.controller', () => {
	let req: Partial<Request> = { body: {} };
	let res: Partial<Response>;
	let next: Partial<NextFunction>;
	let statusMock: jest.Mock;
	let jsonMock: jest.Mock;

	beforeEach(() => {
		jest.clearAllMocks();
		statusMock = jest.fn().mockReturnThis();
		jsonMock = jest.fn();
		res = {
			status: statusMock,
			json: jsonMock,
		};
		next = jest.fn();
	});

	describe('Register', () => {
		it('Should create the user and return a token', async () => {
			(authModel.userExists as jest.Mock).mockResolvedValue(false);
			(authModel.registerUser as jest.Mock).mockResolvedValue({
				token: 'test-token',
				user: {
					id: 'test-user-id',
					email: 'john.doe@example.com',
					name: 'John Doe',
				},
			});

			req.body = {
				email: 'test@example.com',
				name: 'Test User',
				password: 'password',
			};

			await authController.register(
				req as Request,
				res as Response,
				next as NextFunction
			);

			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith({
				token: 'test-token',
				user: {
					id: 'test-user-id',
					name: 'John Doe',
					email: 'john.doe@example.com',
				},
			});
		});

		it('Should respond with a 409 if the user already exists', async () => {
			(authModel.userExists as jest.Mock).mockResolvedValue(true);
			req.body = {
				email: 'test@example.com',
				name: 'Test User',
				password: 'password',
			};

			await authController.register(
				req as Request,
				res as Response,
				next as NextFunction
			);

			expect(statusMock).toHaveBeenCalledWith(409);
			expect(jsonMock).toHaveBeenCalledWith({
				message: 'User already exists.',
			});
		});

		it('Should respond with a 500 if an error is thrown', async () => {
			(authModel.userExists as jest.Mock).mockResolvedValue(false);
			(authModel.registerUser as jest.Mock).mockRejectedValue(
				new Error('Nope, cannot hash password.')
			);

			req.body = {
				email: 'test@example.com',
				name: 'Test User',
				password: 'password',
			};

			await authController.register(
				req as Request,
				res as Response,
				next as NextFunction
			);

			expect(statusMock).toHaveBeenCalledWith(500);
			expect(jsonMock).toHaveBeenCalledWith({
				message: 'Something went wrong.',
			});
		});
	});

	describe('Login', () => {
		it('Should successfully log in a user and return a token', async () => {
			const user = {
				id: '123456',
				email: 'test@example.com',
				name: 'Test User',
			};
			(authModel.logInUser as jest.Mock).mockResolvedValue({
				token: 'test-token',
				user,
			});

			req.body = { email: 'test@example.com', password: 'password' };

			await authController.login(
				req as Request,
				res as Response,
				next as NextFunction
			);

			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith({
				token: 'test-token',
				user,
			});
		});

		it('Should respond with a 401 when invalid credentials are provided', async () => {
			(authModel.logInUser as jest.Mock).mockRejectedValue(
				new Error('Invalid credentials.')
			);

			req.body = {
				email: 'test@example.com',
				password: 'definitely-not-the-correct-password',
			};

			await authController.login(
				req as Request,
				res as Response,
				next as NextFunction
			);

			expect(statusMock).toHaveBeenCalledWith(401);
			expect(jsonMock).toHaveBeenCalledWith({
				message: 'Invalid credentials.',
			});
		});

		it('Should respond with a 500 if an unknown error is thrown by logInUser', async () => {
			(authModel.logInUser as jest.Mock).mockRejectedValue(
				new Error('This is a mystery error...')
			);

			req.body = {
				email: 'test@example.com',
				password: 'password',
			};

			await authController.login(
				req as Request,
				res as Response,
				next as NextFunction
			);

			expect(statusMock).toHaveBeenCalledWith(500);
			expect(jsonMock).toHaveBeenCalledWith({
				message: 'Something went wrong.',
			});
		});
	});
});
