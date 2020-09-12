const mongoose = require('mongoose')
const Indfut = mongoose.model('Indfut')
const Fintwit = mongoose.model('Fintwit')
const { ttoj, tryToFloat, trechoHtmlDeLink } = require('./../services/metodos')
const consultas_mdb = require('./../models/consultas')
const SentimentosPalavras = mongoose.model('SentimentosPalavras')

module.exports = {
    async coletarDadosHistoricos(req, res) {
        try {

            console.log("coletando dados historicos do INDFUT")

            const linkInvesting = "https://br.investing.com/indices/ibovespa-futures-historical-data"
            const nomeTabelaComDados = "curr_table"
            let tabelaResultados = await trechoHtmlDeLink(linkInvesting, nomeTabelaComDados)

            console.log(" : fazendo ajustes para insercao")

            // converte tabela em HTML p/ JSON
            tabelaResultados = ttoj(tabelaResultados)

            // faz conversao dos dados
            for (let dia of tabelaResultados) {

                const dataAntiga = dia["data"].split('.')
                dia["data"] = new Date(dataAntiga[2], parseInt(dataAntiga[1])-1, dataAntiga[0])  

                const fator = 1000

                // converte para numeros
                dia["ultimo"] = tryToFloat(dia["ultimo"])*fator
                dia["abertura"] = tryToFloat(dia["abertura"])*fator
                dia["maxima"] = tryToFloat(dia["maxima"])*fator
                dia["minima"] = tryToFloat(dia["minima"])*fator
                dia["volume"] = tryToFloat(dia["volume"].replace(',','.').replace('K', ''))*fator
                dia["variacao"] = tryToFloat(dia["variacao"].replace(',','.').replace('%', ''))
                dia["max_min"] = dia["maxima"] - dia["minima"]
            }

            console.log(" : inserindo dados hitoricos no BD")
            
            let qntDias = 0

            for (let dia of tabelaResultados) {
                
                const diaExiste = await Indfut.find({
                    data: dia["data"]
                })

                if(diaExiste.length == 0){
                    await Indfut.create(dia)
                    qntDias++
                } 
            }
            
            console.log(`dias inseridos: ${qntDias}.`)

            res.json({"dias inseridos": qntDias})
        } catch (err) {
            console.error(err)

            res.status(400).json({
                msg: "ErrorCatch"
            })

        }

    },

    async mostrarDadosHistoricos(req, res) {
        try {
           
            // MM(M)-DD(D)-AA(AAAA)
            let { data } = req.params
            data = data ? new Date(data) : "" 

            console.log("coletando dados historicos do BD...");

            const dadosHistoricos = data ? await Indfut.find({ data }) : await Indfut.find({}).sort({ data: -1 })

            res.json(dadosHistoricos)
        } catch (err) {
            console.error(err)

            res.status(400).json({
                msg: "ErrorCatch"
            })
        }
    },

    async mostrarDadosHistoricosMaisIntensidadesTweets(req, res){
        try {

            console.log("coletando e agrupando tweets do BD...")

            // consulta para retornar quantidade de tweets por dia
            const tweetsPorDiaFINTWIT = await Fintwit.aggregate(consultas_mdb.intensidade_t_data)

            console.log("coletando dados do INDFUT do BD...")

            // consulta para retornar dados historicos (tem o mesmo formato da consulta anterior)
            const dadosINDFUT = await Indfut.aggregate(consultas_mdb.ohlc_if_data)

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

    async mostrarDadosHistoricosMaisSentimentosMaisIntensidadesTweets(req, res){
        
        try {
           
            console.log("coletando e agrupando tweets do BD...")

            // consulta para retornar quantidade de tweets por dia
            const tweetsPorDiaFINTWIT = await Fintwit.aggregate(consultas_mdb.intensidade_t_data)

            console.log(`coletando sentimentos historicos dos tweets do BD...`)

            // consulta para retornar sentimentos historicos
            const sentimentosTokens = await SentimentosPalavras.aggregate(consultas_mdb.sentimento_t_data)

            console.log("coletando dados historicos do INDFUT do BD...")

            // consulta para retornar dados historicos (tem o mesmo formato da consulta anterior)
            const dadosINDFUT = await Indfut.aggregate(consultas_mdb.ohlc_if_data)

            console.log("concatenando resultados...")

            for (let linha of dadosINDFUT) {

                // procura por intensidade de tweets
                let arrIntensidade = await tweetsPorDiaFINTWIT.filter(
                    ele => ele._id == linha._id
                )[0]

                // procura por sentimentos dos tweets
                let arrSentimento = await sentimentosTokens.filter(
                    ele => ele._id == linha._id
                )[0]

                linha.entry[0].intensidade = arrIntensidade != undefined ? arrIntensidade.intensidade : -1
                linha.entry[0].sentimento = arrSentimento != undefined ? arrSentimento.entry[0].sentimento : -1
            }

            res.json({dadosINDFUT})
        } catch(err){
            console.error(err)

            res.status(400).json({
                msg: "ErrorCatch"
            })
           
        }
    },

}
