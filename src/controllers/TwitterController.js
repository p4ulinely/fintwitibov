const twitter = require('twitter-lite')
const mongoose = require('mongoose')
const Fintwit = mongoose.model('Fintwit')
const Indfut = mongoose.model('Indfut')
const atomizador = require('./../services/atomiza')
require('dotenv-safe').config()
const axios = require('axios')
const jsdom = require('jsdom')
const { ttoj } = require('./../services/metodos')

const client = new twitter({
    subdomain: "api", // "api" is the default (change for other subdomains)
    version: "1.1", // version "1.1" is the default (change for other subdomains)
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
})

const perfisFintwit = ["cafecomferri", "albuquerque_af", "hbredda",
    "fernandocluiz", "josuenunes", "PabloSpyer", "quantzed",
    "MeninRibeiro", "ThiagoNigro", "helocruz", "FariaLimaElevat",
    "sf2invest"]

module.exports = {
    async mostraTweets(req, res){
        try {

            let perfil = req.params.perfil || "twitter"
            let tweets = []

            console.log(`requesting tweets de "${perfil}"...`)

            const requestTwitter = await client.get("statuses/user_timeline", {
                screen_name: perfil,
                include_entities: true,
                count: 200,
                result_type: "recent" // default: mixed
                // until: "2020-06-11"
            })

            for (let tweet of requestTwitter) {
                tweets.push([tweet.id,
                    tweet.created_at,
                    tweet.text
                ])
            }

            console.log(" :: tweets coletados:", tweets.length)

            return res.json(tweets)
        } catch (err) {

            console.error(err)

            return res.status(400).json({
                msg: "ErrorCatch"
            })
        }
    },

    async coletarFintwit(req, res){
        try {

            let tweetsInseridos = 0
            let tweetsExistentes = 0
            const perfilEspecifico = req.params.perfil
            const perfis = perfilEspecifico ? [perfilEspecifico] : perfisFintwit

            for (let perfil of perfis) {

                console.log(`requesting tweets de "${perfil}"...`)

                const requestTwitter = await client.get("statuses/user_timeline", {
                    screen_name: perfil,
                    include_entities: true,
                    count: 200,
                    result_type: "mixed", // mixed (default), popular or recent
                    // until: "2020-06-10"
                })

                console.log(` :: ${requestTwitter.length} tweets coletados!`)
                console.log(`  : verificando se tweets já existem...`)

                for (let tweet of requestTwitter) {

                    const tweetExiste = await Fintwit.find({
                        tweet_id: tweet.id,
                    })

                    if (tweetExiste.length == 0) {
                        await Fintwit.create({
                            perfil,
                            tweet_id: tweet.id,
                            created_at: tweet.created_at,
                            text: tweet.text,
                            hashtags: tweet.hashtags,
                            symbols: tweet.symbols
                        })

                        tweetsInseridos++
                    } else tweetsExistentes++
                }
            }

            console.log("inseridos:", tweetsInseridos)
            console.log("já existentes:", tweetsExistentes)

            return res.json({
                "inseridos": tweetsInseridos,
                "existentes": tweetsExistentes
            })

        } catch (err) {

            console.error(err)

            return res.status(400).json({
                msg: "ErrorCatch"
            })
        }
    },
	
    async mostrarFintwit(req, res){
        try {
            
            const { perfil = "todos" } = req.params
            const { page = 1 } = req.query
            let tweets = null

            console.log("coletando do BD...")
                
            if (perfil != "" && perfil != "todos" ){
                tweets = await Fintwit.paginate({ perfil }, {
                    page,
                    limit: 50, 
                    sort: {
                        created_at: -1
                    }
                })
            } else {
                tweets = await Fintwit.paginate({}, {
                    page,
                    limit: 50, 
                    sort: {
                        created_at: -1
                    }
                })
            }

            console.log(`tweets coletados: ${tweets.total}, pagina: ${tweets.page}, paginas: ${tweets.pages}`)

            return res.json({ tweets })

        } catch (err) {

            console.error(err)

            return res.status(400).json({
                msg: "ErrorCatch"
            })
        }
    },

    async calcularFrequencia(req, res) {
        try {
            
            let frasePOST = req.body.frase || ""
            
            console.log("calculando frequencias...")

            let freq = frasePOST == "" ? "vazio" : atomizador.frequencia(frasePOST)

            console.log(` :: ${freq.length} frequencias calculadas para "${frase}"`)
            
            res.json({ freq })
        } catch (err) {

            console.error(err)

            res.status(400).json({
                msg: "ErrorCatch"
            })
        }
    },
    
    async tweetsPorData(req, res){
        try {
         
            console.log("coletando e agrupando tweets do BD...")

            const tweetsBD = await Fintwit.aggregate([{
                $group: {
                    _id : {
                        $dateToString: { format: "%d-%m-%Y", date: "$created_at" }
                    },
                    entry: {
                        $push: {
                            tweet_id: "$tweet_id",
                            perfil: "$perfil",
                            text: "$text",
                            hashtags: "$hashtags"
                        }
                    }
                }
                
            }])

           res.json(tweetsBD)
        } catch (err) {
            console.error(err) 

            res.status(400).json({
                msg: "ErrorCatch"
            })
        }
    },

    async intensidadeTweetsPorData(req, res) {
        try {
            
            console.log("coletando e agrupando tweets do BD...")

            // consulta para retornar quantidade de tweets por dia
            const tweetsPorDiaFINTWIT = await Fintwit.aggregate([
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%d-%m-%Y", date: "$created_at" }
                        },
                        intensidade: {
                            $sum: 1
                        }
                    }
                }
            ])

            console.log("coletando dados do INDFUT do BD...")

            // consulta para retornar dados historicos no mesmo formato da consulta anterior
            const dadosINDFUT = await Indfut.aggregate([
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%d-%m-%Y", date: "$data" }
                        },
                        entry: {
                            $push: {
                                ultimo: "$ultimo",
                                abertura: "$abertura",
                                maxima: "$maxima",
                                minima: "$minima",
                                volume: "$volume",
                                variacao: "$variacao",
                                max_min: "$max_min"
                            }
                        }
                    }
                }
                // {
                    // $sort: {
                        // _id: -1
                    // }
                // }
            ])

            console.log("concatenando resultados...")

            for (let linha of dadosINDFUT) {

                // procura por intensidade de tweets
                let arrIntensidade = await tweetsPorDiaFINTWIT.filter(
                    ele => ele._id == linha._id
                )[0]

                linha.entry[0].intensidade = arrIntensidade != undefined ? arrIntensidade.intensidade : -1
            }

            res.json(dadosINDFUT)
        } catch (err) {
            console.error(err)

            res.status(400).json({
                msg: "ErrorCatch"
            })
        }
    },

}
