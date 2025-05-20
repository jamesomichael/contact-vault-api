import mongoose from 'mongoose';

import Contact from '../../src/db/models/Contact';
import * as contactsModel from '../../src/models/contacts.model';
import { ContactDocument, CreateContactDto } from '../../src/types/contact';

jest.mock('../../src/db/models/Contact');

describe('contacts.model', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('createContact', () => {
		it('Should create a new contact', async () => {
			const timeNow = +new Date();
			const contactData: CreateContactDto = {
				name: 'John Doe',
				email: 'john.doe@example.com',
				phoneNumber: '1234567890',
				type: 'personal',
			};
			const mockSave = jest.fn().mockResolvedValue(undefined);
			(Contact as unknown as jest.Mock).mockImplementation(() => ({
				id: 'test-user-id',
				...contactData,
				createdAt: timeNow,
				updatedAt: timeNow,
				save: mockSave,
			}));

			const result = await contactsModel.createContact(
				contactData,
				'test-user-id'
			);

			expect(mockSave).toHaveBeenCalled();
			expect(result).toEqual({
				id: 'test-user-id',
				...contactData,
				createdAt: timeNow,
				updatedAt: timeNow,
			});
		});
	});

	describe('getContacts', () => {
		it('Should get all contacts for a user', async () => {
			const timeNow = +new Date();
			const contactDocuments: Partial<ContactDocument>[] = [
				{
					id: 'test-contact-id-1',
					name: 'John Doe',
					email: 'john.doe@example.com',
					phoneNumber: '1234567890',
					type: 'personal',
					createdAt: timeNow,
					updatedAt: timeNow,
				},
				{
					id: 'test-contact-id-2',
					name: 'Jane Doe',
					email: 'jane.doe@example.com',
					phoneNumber: '0987654321',
					type: 'business',
					createdAt: timeNow,
					updatedAt: timeNow,
				},
			];

			(Contact.find as jest.Mock).mockImplementation(() => ({
				sort: jest.fn().mockResolvedValue(contactDocuments),
			}));

			const result = await contactsModel.getContacts('test-user-id');

			expect(result).toEqual(
				contactDocuments.map(
					({
						id,
						name,
						email,
						phoneNumber,
						type,
						createdAt,
						updatedAt,
					}) => ({
						id,
						name,
						email,
						phoneNumber,
						type,
						createdAt,
						updatedAt,
					})
				)
			);
		});
	});

	describe('getContactById', () => {
		it('Should get a contact by its ID', async () => {
			const timeNow = +new Date();
			const contactDocument: Partial<ContactDocument> = {
				id: 'test-contact-id-1',
				name: 'John Doe',
				email: 'john.doe@example.com',
				phoneNumber: '1234567890',
				type: 'personal',
				createdAt: timeNow,
				updatedAt: timeNow,
			};

			(Contact.findOne as jest.Mock).mockResolvedValue(contactDocument);

			const result = await contactsModel.getContactById(
				'test-contact-id-1',
				'test-user-id'
			);

			expect(result).toEqual({
				id: contactDocument.id,
				name: contactDocument.name,
				email: contactDocument.email,
				phoneNumber: contactDocument.phoneNumber,
				type: contactDocument.type,
				createdAt: contactDocument.createdAt,
				updatedAt: contactDocument.updatedAt,
			});
		});

		it('Should throw an error if the contact does not exist', async () => {
			(Contact.findOne as jest.Mock).mockResolvedValue(null);

			const promise = contactsModel.getContactById(
				'invalid-contact-id-1',
				'test-user-id'
			);

			await expect(promise).rejects.toThrow('Contact not found.');
		});
	});

	describe('updateContact', () => {
		it('Should update a contact', async () => {
			const timeNow = +new Date();
			const contactDocument: Partial<ContactDocument> = {
				id: 'test-contact-id-1',
				name: 'John Doe',
				email: 'john.doe.updated@example.com',
				phoneNumber: '1234567890',
				type: 'personal',
				createdAt: timeNow,
				updatedAt: timeNow,
			};

			(Contact.findOneAndUpdate as jest.Mock).mockResolvedValue(
				contactDocument
			);

			const result = await contactsModel.updateContact(
				{ email: 'john.doe.updated@example.com' },
				'test-contact-id-1',
				'test-user-id'
			);

			expect(result).toEqual({
				id: contactDocument.id,
				name: contactDocument.name,
				email: contactDocument.email,
				phoneNumber: contactDocument.phoneNumber,
				type: contactDocument.type,
				createdAt: contactDocument.createdAt,
				updatedAt: contactDocument.updatedAt,
			});
		});

		it('Should throw an error if the contact does not exist', async () => {
			(Contact.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

			const promise = contactsModel.updateContact(
				{ email: 'john.doe.updated@example.com' },
				'invalid-contact-id-1',
				'test-user-id'
			);

			await expect(promise).rejects.toThrow('Contact not found.');
		});
	});

	describe('deleteContact', () => {
		it('Should delete a contact', async () => {
			const timeNow = +new Date();
			const contactDocument: Partial<ContactDocument> = {
				id: 'test-contact-id-1',
				name: 'John Doe',
				email: 'john.doe@example.com',
				phoneNumber: '1234567890',
				type: 'personal',
				createdAt: timeNow,
				updatedAt: timeNow,
			};

			(Contact.findOneAndDelete as jest.Mock).mockResolvedValue(
				contactDocument
			);

			const result = await contactsModel.deleteContact(
				'test-contact-id-1',
				'test-user-id'
			);

			expect(result).toEqual(true);
		});

		it('Should throw an error if the contact does not exist', async () => {
			(Contact.findOneAndDelete as jest.Mock).mockResolvedValue(null);

			const promise = contactsModel.deleteContact(
				'invalid-contact-id-1',
				'test-user-id'
			);

			await expect(promise).rejects.toThrow('Contact not found.');
		});
	});

	describe('isValidObjectId', () => {
		it('Should return true for a valid object ID', async () => {
			const objectId = new mongoose.Types.ObjectId().toString();
			const result = await contactsModel.isValidObjectId(objectId);
			expect(result).toEqual(true);
		});

		it('Should return false for an invalid object ID', async () => {
			const objectId = '0';
			const result = await contactsModel.isValidObjectId(objectId);
			expect(result).toEqual(false);
		});
	});
});
