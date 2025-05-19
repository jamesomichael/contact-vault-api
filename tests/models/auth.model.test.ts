import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../../src/db/models/User';
import * as authModel from '../../src/models/auth.model';

jest.mock('../../src/db/models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('auth.model', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('userExists', () => {
		it('Should return the user if it exists', async () => {
			(User.findOne as jest.Mock).mockImplementation(() => ({
				lean: jest.fn().mockResolvedValue({
					_id: 'test-user-id',
					name: 'John Doe',
					email: 'john.doe@example.com',
					password: 'hashed-password',
					createdAt: 1234567890,
				}),
			}));

			const emailAddress = 'john.doe@example.com';
			const result = await authModel.userExists(emailAddress);

			expect(User.findOne).toHaveBeenCalledWith({ email: emailAddress });
			expect(result).toEqual({
				_id: 'test-user-id',
				name: 'John Doe',
				email: 'john.doe@example.com',
				password: 'hashed-password',
				createdAt: 1234567890,
			});
		});
	});

	describe('registerUser', () => {
		it('Should successfully register a new user', async () => {
			const createdAt = +new Date();
			const mockSave = jest.fn().mockResolvedValue(undefined);
			(bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
			(bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
			(jwt.sign as jest.Mock).mockReturnValue('test-token');
			(User as unknown as jest.Mock).mockImplementation(() => ({
				id: '123456',
				email: 'john.doe@example.com',
				name: 'John Doe',
				password: 'hashed-password',
				createdAt,
				save: mockSave,
			}));

			const result = await authModel.registerUser(
				'John Doe',
				'john.doe@example.com',
				'test-password'
			);

			expect(mockSave).toHaveBeenCalled();
			expect(result).toEqual({
				token: 'test-token',
				user: {
					id: '123456',
					name: 'John Doe',
					email: 'john.doe@example.com',
					createdAt,
				},
			});
		});

		it('Should throw an error if a new user cannot be registered', async () => {
			const errorMessage = 'Nope, cannot hash password.';
			(bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
			(bcrypt.hash as jest.Mock).mockRejectedValue(
				new Error(errorMessage)
			);

			const promise = authModel.registerUser(
				'John Doe',
				'john.doe@example.com',
				'test-password'
			);
			await expect(promise).rejects.toThrow(errorMessage);
		});
	});

	describe('logInUser', () => {
		it('Should successfully log in an existing user', async () => {
			const createdAt = +new Date();
			(bcrypt.compare as jest.Mock).mockResolvedValue(true);
			(bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
			(jwt.sign as jest.Mock).mockReturnValue('test-token');
			(User.findOne as jest.Mock).mockImplementation(() => ({
				id: '123456',
				email: 'john.doe@example.com',
				name: 'John Doe',
				password: 'hashed-password',
				createdAt,
			}));

			const result = await authModel.logInUser(
				'john.doe@example.com',
				'test-password'
			);

			expect(result).toEqual({
				token: 'test-token',
				user: {
					id: '123456',
					name: 'John Doe',
					email: 'john.doe@example.com',
					createdAt,
				},
			});
		});

		it('Should fail to log in if the user does not exist', async () => {
			const errorMessage = 'Invalid credentials.';
			(User.findOne as jest.Mock).mockImplementation(() => null);

			const promise = authModel.logInUser(
				'john.doe@example.com',
				'test-password'
			);
			await expect(promise).rejects.toThrow(errorMessage);
		});

		it('Should fail to log in if an incorrect password is used', async () => {
			const errorMessage = 'Invalid credentials.';
			(User.findOne as jest.Mock).mockImplementation(() => ({
				id: '123456',
				email: 'john.doe@example.com',
				name: 'John Doe',
				password: 'hashed-password',
				createdAt: +new Date(),
			}));
			(bcrypt.compare as jest.Mock).mockResolvedValue(false);

			const promise = authModel.logInUser(
				'john.doe@example.com',
				'test-password'
			);
			await expect(promise).rejects.toThrow(errorMessage);
		});
	});
});
