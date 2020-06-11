const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const FintwitSchema = new mongoose.Schema({
    perfil: {
        type: String,
        required: true

    }, tweet_id: {
        type: Number,
        required: true,
        unique: true

    }, created_at: {
        type: Date,
        required: true
            
    }, text: {
        type: String,
        required: true

    }, hashtags: [
        String

    ], symbols: [
        String
    ]
})

FintwitSchema.plugin(mongoosePaginate)
mongoose.model('Fintwit', FintwitSchema)
