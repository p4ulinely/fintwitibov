const twitter = require('twitter-lite')
require('dotenv-safe').config()
const mongoose = require('mongoose')
const Fintwit = mongoose.model('Fintwit')

const client = new twitter({
    subdomain: "api", // "api" is the default (change for other subdomains)
    version: "1.1", // version "1.1" is the default (change for other subdomains)
    consumer_key: process.env.TWITTER_CONSUMER_KEY, // from Twitter.
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET, // from Twitter.
    access_token_key: process.env.ACCESS_TOKEN, // from your User (oauth_token)
    access_token_secret: process.env.ACCESS_TOKEN_SECRET// from your User (oauth_token_secret)
})

module.exports = {
    async getTweets(req, res){
		try {

			let perfil = req.params.perfil || ""

			if (perfil.length < 1) perfil = "twitter"

			const requestTwitter = await client.get("statuses/user_timeline", {
				screen_name: perfil,
			})

			let tweets = []

			for (let tweet of requestTwitter) {
				tweets.push([tweet.id, tweet.created_at, tweet.text])
			}

			console.log("tweets coletados:", tweets.length);
			// console.log(requestTwitter[0])

			return res.json(requestTwitter[0])
		} catch (err) {
			return res.status(400).json({
				msg: err
			})
		}
    },

    async coletarFintwit(req, res){
		try {

		    let perfis = ["cafecomferri", "albuquerque_af", "hbredda",
		    "fernandocluiz", "josuenunes", "PabloSpyer",
		    "quantzed", "MeninRibeiro"]
		
			let tweetsInseridos = 0
			let tweetsExistentes = 0

			for (let perfil of perfis) {
				const requestTwitter = await client.get("statuses/user_timeline", {
					screen_name: perfil,
					count: 200
				})

				for (let tweet of requestTwitter) {
					const tweetExiste = await Fintwit.find({
						tweet_id: tweet.id
					})

					if (tweetExiste.length == 0) {
						Fintwit.create({
							perfil,
							tweet_id: tweet.id,
							created_at: tweet.created_at,
							text: tweet.text,
							hashtags: tweet.hashtags,
							symbols: tweet.symbols
						})

						tweetsInseridos += 1
					} else tweetsExistentes += 1
				}
			}

			return res.json({
				"tweets inseridos": tweetsInseridos,
				"tweets existentes": tweetsExistentes
			})

		} catch (err) {
			return res.status(400).json({
				msg: err
			})
		}
	},
	
	async mostrarFintwit(req, res){
		try {
			
			const { perfil = "todos" } = req.params
			const { page = 1 } = req.query
			let tweets = null

			if (perfil != "" && perfil != "todos" ){
				tweets = await Fintwit.paginate({ perfil }, {
					page,
					limit: 20, 
					sort: {
						created_at: -1
					}
				})
			} else {
				tweets = await Fintwit.paginate({}, {
					page,
					limit: 20, 
					sort: {
						created_at: -1
					}
				})
			}

			return res.json({ tweets })

		} catch (err) {
			return res.status(400).json({
				msg: err
			})
		}
    },
}

