const express = require('express')
const mongoose = require('mongoose')
const requireDir = require('require-dir')
require('dotenv-safe').config()

// iniciando app
const app = express()
app.use(express.json())

// //////////////////////////////////////////// BD
mongoose.connect(process.env.CONNECTION_STRING_BD, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log('MongoDB is on!')
}).catch((err) => {
	console.log(`MongoDB: ${err}`)
})
mongoose.set('useFindAndModify', true)
mongoose.set('useUnifiedTopology', true)

// //////////////////////////////////////////// models
requireDir('./src/models')

// //////////////////////////////////////////// controllets
const TwitterController = require('./src/controllers/TwitterController')

app.get('/perfil/:perfil', TwitterController.getTweets)
app.get('/coletar', TwitterController.coletarFintwit)
app.get('/mostrar/:perfil?', TwitterController.mostrarFintwit)

app.listen(process.env.PORT || 8000, () => {
    console.log('Server is On (8000)!')
})
