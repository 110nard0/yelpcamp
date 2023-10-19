import Joi from 'joi'

export const campgroundSchema = Joi.object({
	campground: Joi.object({
		title: Joi.string()
			.required(),

		price: Joi.number()
			.min(0)
			.required(),

		location: Joi.string()
			.required(),

		description: Joi.string()
			.required()
	}).required(),
	deleteImages: Joi.array()
})

export const reviewSchema = Joi.object({
	review: Joi.object({
		body: Joi.string()
			.required(),

		rating: Joi.number()
			.min(1)
			.max(5)
			.required()
	}).required()
})