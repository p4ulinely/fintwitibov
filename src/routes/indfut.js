const express = require('express')
const router = express.Router()
const IndfutController = require('./../controllers/IndfutController')

router.get('/coletar', IndfutController.coletarDadosHistoricos)
router.get('/mostrar/:data?', IndfutController.mostrarDadosHistoricos)
router.get('/pordata/idh', IndfutController.mostrarDadosHistoricosMaisIntensidadesTweets)
router.get('/pordata/sidh', IndfutController.mostrarDadosHistoricosMaisSentimentosMaisIntensidadesTweets)

module.exports = router
