import { Request, Response } from 'express';
import authController from '../../src/controllers/auth.controller';
import User from '../../src/db/models/User';
import * as authModel from '../../src/models/auth.model';

jest.mock('../../src/models/auth.model');
jest.mock('../../src/db/models/User');

describe('auth.controller', () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let statusMock: jest.Mock;
	let jsonMock: jest.Mock;

	beforeEach(() => {
		jest.clearAllMocks();
		statusMock = jest.fn().mockReturnThis();
		jsonMock = jest.fn();
		req = { body: {} };
		res = {
			status: statusMock,
			json: jsonMock,
		};
	});

	describe('Register', () => {
		it('Should create the user and return a token', async () => {
			(authModel.userExists as jest.Mock).mockResolvedValue(false);
			(authModel.generateHashedPassword as jest.Mock).mockResolvedValue(
				'test-hashed-password'
			);
			(authModel.getToken as jest.Mock).mockReturnValue('test-jwt-token');

			const saveMock = jest.fn().mockResolvedValue(undefined);
			(User as jest.Mock).mockImplementation(() => ({
				save: saveMock,
				id: '123456',
				email: 'test@example.com',
				name: 'Test User',
			}));

			req.body = {
				email: 'test@example.com',
				name: 'Test User',
				password: 'password',
			};

			await authController.register(req as Request, res as Response);

			expect(saveMock).toHaveBeenCalled();
			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith({
				token: 'test-jwt-token',
				user: {
					id: '123456',
					name: 'Test User',
					email: 'test@example.com',
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

			await authController.register(req as Request, res as Response);

			expect(statusMock).toHaveBeenCalledWith(409);
			expect(jsonMock).toHaveBeenCalledWith({
				message: 'User already exists.',
			});
		});

		it('Should respond with a 500 if an error is thrown', async () => {
			(authModel.userExists as jest.Mock).mockResolvedValue(false);
			(authModel.generateHashedPassword as jest.Mock).mockRejectedValue(
				new Error('Nope, cannot hash password.')
			);

			const saveMock = jest.fn().mockResolvedValue(undefined);
			(User as jest.Mock).mockImplementation(() => ({
				save: saveMock,
				id: '123456',
				email: 'test@example.com',
				name: 'Test User',
			}));

			req.body = {
				email: 'test@example.com',
				name: 'Test User',
				password: 'password',
			};

			await authController.register(req as Request, res as Response);

			expect(saveMock).not.toHaveBeenCalled();
			expect(statusMock).toHaveBeenCalledWith(500);
			expect(jsonMock).toHaveBeenCalledWith({
				message: 'Something went wrong.',
			});
		});

		describe('Login', () => {
			it('Should successfully log in a user and return a token', async () => {
				const user = {
					id: '123456',
					email: 'test@example.com',
					name: 'Test User',
				};
				(authModel.logInUser as jest.Mock).mockResolvedValue(user);
				(authModel.getToken as jest.Mock).mockReturnValue(
					'test-jwt-token'
				);

				req.body = { email: 'test@example.com', password: 'password' };

				await authController.login(req as Request, res as Response);

				expect(statusMock).toHaveBeenCalledWith(200);
				expect(jsonMock).toHaveBeenCalledWith({
					token: 'test-jwt-token',
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

				await authController.login(req as Request, res as Response);

				expect(statusMock).toHaveBeenCalledWith(401);
				expect(jsonMock).toHaveBeenCalledWith({
					message: 'Invalid credentials.',
				});
			});

			it('Should respond with a 500 if an unknown error is thrown by logInUser', async () => {
				(authModel.logInUser as jest.Mock).mockRejectedValue(
					new Error('This error is a mystery.')
				);

				req.body = {
					email: 'test@example.com',
					password: 'password',
				};

				await authController.login(req as Request, res as Response);

				expect(statusMock).toHaveBeenCalledWith(500);
				expect(jsonMock).toHaveBeenCalledWith({
					message: 'Something went wrong.',
				});
			});

			it('Should respond with a 500 if an unknown error is thrown by getToken', async () => {
				const user = {
					id: '123456',
					email: 'test@example.com',
					name: 'Test User',
				};
				(authModel.logInUser as jest.Mock).mockResolvedValue(user);
				(authModel.getToken as jest.Mock).mockImplementation(() => {
					throw new Error('Another mystery error.');
				});

				req.body = { email: 'test@example.com', password: 'password' };

				await authController.login(req as Request, res as Response);

				expect(statusMock).toHaveBeenCalledWith(500);
				expect(jsonMock).toHaveBeenCalledWith({
					message: 'Something went wrong.',
				});
			});
		});
	});
});
