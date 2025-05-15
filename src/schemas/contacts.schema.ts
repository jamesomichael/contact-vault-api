const { Joi } = require('celebrate');

const createContact = {
	body: Joi.object()
		.keys({
			name: Joi.string()
				.trim()
				.required()
				.messages({ 'any.required': 'Contact name is required.' }),
			email: Joi.string().email(),
			phoneNumber: Joi.string().pattern(/^\+?\d+$/),
			type: Joi.string()
				.valid('personal', 'business')
				.default('personal'),
		})
		.required(),
};

const getContactById = {
	params: Joi.object({
		id: Joi.string().required(),
	}),
};

const updateContact = {
	params: Joi.object({
		id: Joi.string().required(),
	}),
	body: Joi.object({
		name: Joi.string().trim(),
		email: Joi.string().email(),
		phoneNumber: Joi.string().pattern(/^\+?\d+$/),
		type: Joi.string().valid('personal', 'business'),
	}).required(),
};

const deleteContact = {
	params: Joi.object({
		id: Joi.string().required(),
	}),
};

export { createContact, getContactById, updateContact, deleteContact };
