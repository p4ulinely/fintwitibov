const express = require('express')
const router = express.Router()
const IndfutController = require('./../controllers/IndfutController')

router.get('/coletar', IndfutController.coletarDadosHistoricos)
router.get('/mostrar/:data?', IndfutController.mostrarDadosHistoricos)
router.get('/pordata/tdh', IndfutController.mostrarDadosHistoricosMaisIntensidadesTweets)

module.exports = router
