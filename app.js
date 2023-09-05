import ejsMate from 'ejs-mate'
import express from 'express'
import { fileURLToPath } from 'url'
import methodOverride from 'method-override'
import mongoose from 'mongoose'
import path from 'path'

import AppError from './utils/AppError.js'
import campgrounds from './routes/campgrounds.js'
import reviews from './routes/reviews.js'

mongoose.connect('mongodb://localhost:27017/yelpCamp')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'CONECTION ERROR'))
db.once('open', () => { console.log('DATABASE CONNECTED') })

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

app.get('/', (req, res) => {
	res.render('home')
})

app.all('*', (req, res, next) => {
	next(new AppError(404, 'PAGE NOT FOUND'))
})

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err
	if (!err.message) err.message = 'SOMETHING WENT WRONG'
	res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
	console.log('SERVING ON PORT 3000')
})