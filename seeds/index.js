import Campground from '../models/campground.js'
import cities from './cities.js'
import mongoose from 'mongoose'
import { places, descriptors } from './seedHelpers.js'

mongoose.connect('mongodb://localhost:27017/yelpCamp')

const db = mongoose.connection
db.on("error", console.error.bind(console, "CONNECTION ERROR:"))
db.once("open", () => {
	console.log("DATABASE CONNECTED")
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
	await Campground.deleteMany({})
	for (let i = 0; i < 250; i++) {
		const random1000 = Math.floor(Math.random() * 1000)
		const price = Math.floor(Math.random() * 20) + 10
		const camp = new Campground({
			title: `${sample(descriptors)} ${sample(places)}`,
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor deleniti consequatur ipsam! Maiores, id non labore corporis, recusandae iusto corrupti ut, ab ea deleniti laborum in consequuntur dicta dolore eaque?',
			author: '65084e7f88a360be9696d283',
			geometry: {
				type: 'Point',
				coordinates: [
					cities[random1000].longitude,
					cities[random1000].latitude
				],
			},
			images: [
				{
					url: 'https://res.cloudinary.com/dspv3a1pq/image/upload/v1697736518/Yelpcamp/r9gifcvacdfvk5yl5lr2.jpg',
					filename: 'Yelpcamp/r9gifcvacdfvk5yl5lr2',
				},
				{
					url: 'https://res.cloudinary.com/dspv3a1pq/image/upload/v1697736521/Yelpcamp/deoltnkce0gi6xsvxuoo.jpg',
					filename: 'Yelpcamp/deoltnkce0gi6xsvxuoo',
				}
			],
			price,
		})
		await camp.save()
	}
}

seedDB().then(() => {
	mongoose.connection.close()
})