import mongoose from 'mongoose'

const Schema = mongoose.Schema

const CampgroundSchema = new Schema({
	title: String,
	image: String,
	price: Number,
	location: String,
	description: String,
})

export default mongoose.model('Campground', CampgroundSchema)