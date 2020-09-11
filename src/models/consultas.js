const formatoData = "%Y-%m-%d"

const ohlcIndFuturo = 
    [{
        $group: {
            _id: {
                $dateToString: { format: formatoData, date: "$data" }
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
    }]

const intensidadeTweetsPorData =
    [{
        $group: {
            _id: {
                $dateToString: { format: formatoData, date: "$created_at" }
            },
            intensidade: {
                $sum: 1
            }
        }
    }]

const intensidadeTweetsPorDataOrdenado =
    [{
        $group: {
            _id: {
                $dateToString: { format: formatoData, date: "$created_at" }
            },
            intensidade: {
                $sum: 1
            }
        }
    },
    {
        $sort: {
            _id: -1
        }
    }]

const sentimentosTweets =
    [{
        $group: {
            _id : {
                $dateToString: { format: formatoData, date: "$data" }
            },
            entry: {
                $push: {
                    sentimento: "$sentimento",
                    palavras: "$palavras"
                }
            }
        }
    },
    {
        $sort: {
            _id: -1
        }
    }]

exports.ohlc_if_data = ohlcIndFuturo
exports.intensidade_t_data = intensidadeTweetsPorData
exports.intensidade_t_data_ordenado = intensidadeTweetsPorDataOrdenado
exports.sentimento_t_data = sentimentosTweets
