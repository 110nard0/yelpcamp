import mongoose from 'mongoose'

const Schema = mongoose.Schema

const CampgroundSchema = new Schema({
	title: String,
	image: String,
	price: Number,
	location: String,
	description: String,
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review'
		}
	]
})

export default mongoose.model('Campground', CampgroundSchema)