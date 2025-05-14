const { Joi } = require('celebrate');

const create = {
	body: Joi.object()
		.keys({
			name: Joi.string()
				.trim()
				.required()
				.messages({ 'any.required': 'Contact name is required.' }),
			email: Joi.string().email(),
			phoneNumber: Joi.string().pattern(/^\d+$/),
			type: Joi.string()
				.valid('personal', 'business')
				.default('personal'),
		})
		.required(),
};

export { create };
