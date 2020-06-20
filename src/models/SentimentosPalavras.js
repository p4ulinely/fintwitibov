const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const SentimentosPalavrasSchema = new mongoose.Schema({
    data: {
        type: Date,
        required: true

    }, sentimento: {
        type: Number,
        required: true,

    }, palavras: [
        String
    ]
})

SentimentosPalavrasSchema.plugin(mongoosePaginate)
mongoose.model('SentimentosPalavras', SentimentosPalavrasSchema)
