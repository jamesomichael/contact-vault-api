import { NextFunction, Request, Response } from 'express';

import contactsController from '../../src/controllers/contacts.controller';
import * as contactsModel from '../../src/models/contacts.model';
import { AuthorisedRequest } from '../../src/types/auth';

jest.mock('../../src/models/contacts.model');

describe('contacts.controller', () => {
	const req: Partial<Request> = { body: {} };
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

	describe('createContact', () => {
		it('Should successfully create a new contact', async () => {
			(contactsModel.createContact as jest.Mock).mockResolvedValue({
				id: 'test-contact-id',
				name: 'John Doe',
				email: 'john.doe@example.com',
				phoneNumber: '1234567890',
				type: 'personal',
			});

			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			req.body = {
				name: 'John Doe',
				email: 'john.doe@example.com',
				phoneNumber: '1234567890',
				type: 'personal',
			};

			await contactsController.createContact(
				req as Request,
				res as Response,
				next as NextFunction
			);

			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith({
				id: 'test-contact-id',
				name: 'John Doe',
				email: 'john.doe@example.com',
				phoneNumber: '1234567890',
				type: 'personal',
			});
		});

		it('Should respond with a 500 if an unknown error is thrown', async () => {
			(contactsModel.createContact as jest.Mock).mockRejectedValue(
				new Error('Cannot add contact.')
			);

			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			req.body = {
				name: 'John Doe',
				email: 'john.doe@example.com',
				phoneNumber: '1234567890',
				type: 'personal',
			};

			await contactsController.createContact(
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

	describe('fetchContacts', () => {
		it('Should successfully fetch all contacts', async () => {
			const contacts = [
				{
					id: 'test-contact-id-1',
					name: 'John Doe',
					email: 'john.doe@example.com',
					phoneNumber: '1234567890',
					type: 'personal',
				},
				{
					id: 'test-contact-id-2',
					name: 'Jane Doe',
					email: 'jane.doe@example.com',
					phoneNumber: '0987654321',
					type: 'business',
				},
			];

			(contactsModel.getContacts as jest.Mock).mockResolvedValue(
				contacts
			);

			(req as AuthorisedRequest).user = { id: 'test-user-id' };

			await contactsController.fetchContacts(
				req as Request,
				res as Response,
				next as NextFunction
			);

			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith({ contacts });
		});

		it('Should respond with a 500 if an unknown error is thrown', async () => {
			(contactsModel.getContacts as jest.Mock).mockRejectedValue(
				new Error('Cannot get contacts.')
			);

			(req as AuthorisedRequest).user = { id: 'test-user-id' };

			await contactsController.fetchContacts(
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

	describe('fetchContactById', () => {
		it('Should successfully fetch a contact by its ID', async () => {
			const contact = {
				id: 'test-contact-id-1',
				name: 'John Doe',
				email: 'john.doe@example.com',
				phoneNumber: '1234567890',
				type: 'personal',
			};

			(contactsModel.isValidObjectId as jest.Mock).mockReturnValue(true);
			(contactsModel.getContactById as jest.Mock).mockResolvedValue(
				contact
			);

			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			req.params = { id: 'test-contact-id-1' };

			await contactsController.fetchContactById(
				req as Request,
				res as Response,
				next as NextFunction
			);

			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith(contact);
		});

		it('Should respond with a 400 if an invalid contact ID is used', async () => {
			(contactsModel.isValidObjectId as jest.Mock).mockReturnValue(false);

			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			req.params = { id: 'invalid-contact-id' };

			await contactsController.fetchContactById(
				req as Request,
				res as Response,
				next as NextFunction
			);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(jsonMock).toHaveBeenCalledWith({
				message: 'Contact ID is invalid.',
			});
		});

		it('Should respond with a 404 if the contact does not exist', async () => {
			(contactsModel.isValidObjectId as jest.Mock).mockReturnValue(true);
			(contactsModel.getContactById as jest.Mock).mockRejectedValue(
				new Error('Contact not found.')
			);

			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			req.params = { id: 'test-contact-id-1' };

			await contactsController.fetchContactById(
				req as Request,
				res as Response,
				next as NextFunction
			);

			expect(statusMock).toHaveBeenCalledWith(404);
			expect(jsonMock).toHaveBeenCalledWith({
				message: 'Contact not found.',
			});
		});

		it('Should respond with a 500 if an unknown error is thrown', async () => {
			(contactsModel.isValidObjectId as jest.Mock).mockReturnValue(true);
			(contactsModel.getContactById as jest.Mock).mockRejectedValue(
				new Error('Cannot get contact.')
			);

			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			req.params = { id: 'test-contact-id-1' };

			await contactsController.fetchContactById(
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

	describe('updateContact', () => {
		it('Should successfully update a contact', async () => {
			const contact = {
				id: 'test-contact-id-1',
				name: 'John Doe',
				email: 'john.doe.updated@example.com',
				phoneNumber: '1234567890',
				type: 'personal',
			};

			(contactsModel.isValidObjectId as jest.Mock).mockReturnValue(true);
			(contactsModel.updateContact as jest.Mock).mockResolvedValue(
				contact
			);

			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			req.params = { id: 'test-contact-id-1' };
			req.body = {
				email: 'john.doe.updated@example.com',
			};

			await contactsController.updateContact(
				req as Request,
				res as Response,
				next as NextFunction
			);

			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith(contact);
		});

		it('Should respond with a 400 if an invalid contact ID is used', async () => {
			(contactsModel.isValidObjectId as jest.Mock).mockReturnValue(false);

			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			req.params = { id: 'invalid-contact-id' };
			req.body = {
				email: 'john.doe.updated@example.com',
			};

			await contactsController.updateContact(
				req as Request,
				res as Response,
				next as NextFunction
			);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(jsonMock).toHaveBeenCalledWith({
				message: 'Contact ID is invalid.',
			});
		});

		it('Should respond with a 404 if the contact does not exist', async () => {
			(contactsModel.isValidObjectId as jest.Mock).mockReturnValue(true);
			(contactsModel.updateContact as jest.Mock).mockRejectedValue(
				new Error('Contact not found.')
			);

			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			req.params = { id: 'test-contact-id-1' };
			req.body = {
				email: 'john.doe.updated@example.com',
			};

			await contactsController.updateContact(
				req as Request,
				res as Response,
				next as NextFunction
			);

			expect(statusMock).toHaveBeenCalledWith(404);
			expect(jsonMock).toHaveBeenCalledWith({
				message: 'Contact not found.',
			});
		});

		it('Should respond with a 500 if an unknown error is thrown', async () => {
			(contactsModel.isValidObjectId as jest.Mock).mockReturnValue(true);
			(contactsModel.updateContact as jest.Mock).mockRejectedValue(
				new Error('Cannot update contact.')
			);

			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			req.params = { id: 'test-contact-id-1' };
			req.body = {
				email: 'john.doe.updated@example.com',
			};

			await contactsController.updateContact(
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

	describe('deleteContact', () => {
		it('Should successfully delete a contact', async () => {
			(contactsModel.isValidObjectId as jest.Mock).mockReturnValue(true);
			(contactsModel.deleteContact as jest.Mock).mockResolvedValue(null);

			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			req.params = { id: 'test-contact-id-1' };

			await contactsController.deleteContact(
				req as Request,
				res as Response,
				next as NextFunction
			);

			expect(statusMock).toHaveBeenCalledWith(204);
		});

		it('Should respond with a 400 if an invalid contact ID is used', async () => {
			(contactsModel.isValidObjectId as jest.Mock).mockReturnValue(false);

			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			req.params = { id: 'invalid-contact-id' };

			await contactsController.deleteContact(
				req as Request,
				res as Response,
				next as NextFunction
			);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(jsonMock).toHaveBeenCalledWith({
				message: 'Contact ID is invalid.',
			});
		});

		it('Should respond with a 404 if the contact does not exist', async () => {
			(contactsModel.isValidObjectId as jest.Mock).mockReturnValue(true);
			(contactsModel.deleteContact as jest.Mock).mockRejectedValue(
				new Error('Contact not found.')
			);

			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			req.params = { id: 'test-contact-id-1' };

			await contactsController.deleteContact(
				req as Request,
				res as Response,
				next as NextFunction
			);

			expect(statusMock).toHaveBeenCalledWith(404);
			expect(jsonMock).toHaveBeenCalledWith({
				message: 'Contact not found.',
			});
		});

		it('Should respond with a 500 if an unknown error is thrown', async () => {
			(contactsModel.isValidObjectId as jest.Mock).mockReturnValue(true);
			(contactsModel.deleteContact as jest.Mock).mockRejectedValue(
				new Error('Cannot delete contact.')
			);

			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			req.params = { id: 'test-contact-id-1' };

			await contactsController.deleteContact(
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
