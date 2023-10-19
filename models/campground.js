import mongoose from 'mongoose'
import Review from './review.js'

const Schema = mongoose.Schema
const CampgroundSchema = new Schema({
	title: String,
	price: Number,
	location: String,
	description: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	images: [
		{
			url: String,
			filename: String
		}
	],
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review'
		}
	]
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
	if (doc) {
		await Review.deleteMany({ _id: { $in: doc.reviews } })
	}
})

export default mongoose.model('Campground', CampgroundSchema)