const express = require('express')
const router = express.Router()
const TwitterController = require('./../controllers/TwitterController')

router.get('/perfil/:perfil?', TwitterController.getTweets)
router.get('/coletar/:perfil?', TwitterController.coletarFintwit)
router.get('/mostrar/:perfil?', TwitterController.mostrarFintwit)
router.post('/freq/:frase?', TwitterController.calcularFrequencia)
router.get('/pordata/tweets', TwitterController.tweetsPorData)
router.get('/pordata/itweets', TwitterController.intensidadeTweetsPorData)
router.get('/sentimentos7/gera', TwitterController.geraSentimentosSeteDia)
router.get('/sentimentos7/mostra', TwitterController.mostraSentimentosSeteDia)

module.exports = router
