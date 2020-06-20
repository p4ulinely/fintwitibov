const mongoose = require('mongoose')
const Indfut = mongoose.model('Indfut')
const Fintwit = mongoose.model('Fintwit')
const axios = require('axios')
const jsdom = require('jsdom')
const { ttoj } = require('./../services/metodos')

const tryToFloat = str => {
    const num = parseFloat(str)
    return isNaN(num) ? 0 : num
}

module.exports = {

    async coletarDadosHistoricos(req, res) {
        try {

            console.log("coletando dados historicos do INDFUT, no Investing...")

            const resultadosINVESTING = await axios.get("https://br.investing.com/indices/ibovespa-futures-historical-data")

            console.log(" : convertendo dados para DOM...")

            const nomeTabelaComDados = "curr_table"
            const doc = new jsdom.JSDOM(resultadosINVESTING.data)    
            let tabelaResultados = doc.window.document.querySelector(`#${nomeTabelaComDados}`)

            console.log(" : convertendo tabela HTML para JSON...")

            tabelaResultados = ttoj(tabelaResultados)

            console.log(" : fazendo ajustes para insercao...")

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

            console.log("inserindo dados hitoricos no BD...")
            
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
            const tweetsPorDiaFINTWIT = await Fintwit.aggregate([
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$created_at" }
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
                            $dateToString: { format: "%Y-%m-%d", date: "$data" }
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
                },
                {
                    $sort: {
                        _id: -1
                    }
                }
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
