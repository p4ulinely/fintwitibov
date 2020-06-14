const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const IndfutSchema = new mongoose.Schema({
    data: {
        type: Date,
        required: true,
        unique: true

    }, ultimo: {
        type: Number,
        required: true

    }, abertura: {
        type: Number,
        required: true
            
    }, maxima: {
        type: Number,
        required: true

    }, minima: {
        type: Number,
        required: true

    }, volume: {
        type: Number,
        required: true
    
    }, variacao: {
        type: Number,
        required: true
    
    }, max_min: {
        type: Number,
        required: true
    
    }
})

IndfutSchema.plugin(mongoosePaginate)
mongoose.model('Indfut', IndfutSchema)
