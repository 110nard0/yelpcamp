import ejsMate from 'ejs-mate'
import express from 'express'
import { fileURLToPath } from 'url'
import flash from 'connect-flash'
import LocalStrategy from 'passport-local'
import methodOverride from 'method-override'
import mongoose from 'mongoose'
import passport from 'passport'
import path from 'path'
import session from 'express-session'

import AppError from './utils/AppError.js'
import campgroundRoutes from './routes/campgrounds.js'
import reviewRoutes from './routes/reviews.js'
import User from './models/user.js'
import userRoutes from './routes/users.js'

mongoose.connect('mongodb://localhost:27017/yelpCamp')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'CONECTION ERROR'))
db.once('open', () => { console.log('DATABASE CONNECTED') })

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const sessionConfig = {
	secret: 'insertsafesecret',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}

app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session(sessionConfig))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(flash())
app.use((req, res, next) => {
	res.locals.user = req.user
	res.locals.error = req.flash('error')
	res.locals.success = req.flash('success')
	next()
})

app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', userRoutes)

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
