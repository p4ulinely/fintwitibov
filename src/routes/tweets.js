const express = require('express')
const router = express.Router()
const TwitterController = require('./../controllers/TwitterController')

router.get('/perfil/:perfil?', TwitterController.getTweets)
router.get('/coletar/:perfil?', TwitterController.coletarFintwit)
router.get('/mostrar/:perfil?', TwitterController.mostrarFintwit)
router.get('/freq/:frase?', TwitterController.calcularFrequencia)
router.get('/pordata/tweets', TwitterController.tweetsPorData)
router.get('/pordata/itweets', TwitterController.intensidadeTweetsPorData)
router.get('/pordata/sent', TwitterController.sentimentoDoDia)

module.exports = router
