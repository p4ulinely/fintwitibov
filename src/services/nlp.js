const fs = require('fs')
const sw = require('./stop_words_pt')

const converteOntoPTEmObjeto = () => {

    // let endereco = "/Users/paulinelymorgan/git/fintwit/src/services/synsets_polarizados_ontopt06.txt"
    endereco = './ex_lib.txt'
    const data = fs.readFileSync(endereco, {encoding:'utf8', flag:'r'})
    let arquivoLido = data.toString().split('\n')
    arquivoLido.pop()
    
    let lib = {
       "-1": [],
       "0": [],
       "1": []
    }

    for(let i of arquivoLido){
        let linha = i.split(':')
        let pol = linha[0].replace(/\s/g, '') 
        let lexemas = linha[2].replace(/(\[|\]|\s)/g,'')

        for (let key of Object.keys(lib)) {
            if (pol == key) {
                for (let lexema of lexemas.split(','))
                    lib[key].push(lexema)
                break
            } 
        }
    }

    return lib
}

const escreveArquivoJson = (obj, nome) => {
    try {
        fs.writeFileSync(`./${nome}.json`, JSON.stringify(obj) , 'utf-8') 
    } catch(err){
        console.error(err)
    }
} 

const lerArquivoJson = arquivo => {
    try {

        const data = fs.readFileSync(`./${arquivo}`, {encoding:'utf8', flag:'r'})

        return JSON.parse(data)
    } catch (err) {
        console.error(err)
    }
} 

const criaLibOntoPTEmArquivoJson = () => {
    const nomeArquivo = "lib-resumida_onto-pt" 
    
    escreveArquivoJson(converteOntoPTEmObjeto(), nomeArquivo)    
}

const carregaOntoPT = () => {
    return lerArquivoJson(`lib-resumida_onto-pt.json`)
}

const sentimentoDaPalavra = (lib, palavra) => {

    let neg = lib["-1"].indexOf(palavra)
    let neu = lib["0"].indexOf(palavra)
    let pos = lib["1"].indexOf(palavra)

    sentimento = []

    if(neg != -1) sentimento.push("neg")
    if(neu != -1) sentimento.push("neu")
    if(pos != -1) sentimento.push("pos")

    return sentimento
}

// metodo que retorna frase como objeto de palavras e suas respectivas frequencias
const geraListaDeFrequenciasDasPalavras = str => {

    const listaTokens = []
    const tokensUnicos = new Set()
    const tokensUnicosFrequencia = []
    let linhas = str.split('\n')

    for(let linha of linhas){
        let tokens = atomizador(linha)
        tokens.forEach(t => {
            listaTokens.push(t)
            tokensUnicos.add(t)
        })
    }

    for(let token of tokensUnicos){
        let qnt = listaTokens.filter(t => t == token).length
        tokensUnicosFrequencia.push({
            't': token,
            'f': qnt
        })
    }

    return tokensUnicosFrequencia
}

// metodo para atomizador frases em palavras e suas respectivas frequencias
const atomizador = frase => {

    const proibidos = [';', ',', '.', ':', '(', ')', '{', '}', '[', ']', '…', '!', '?']
    let palavrasComFrequencias = []
    
    frase = frase.split(' ')

    for(let i = 0; i < frase.length; i++){
        palavra = frase[i].toLowerCase()
        
        if(eUmaURL(palavra)) continue // elimina urls
        if(palavra.indexOf('@') != -1) continue // elimina mencoes
        if(sw.stopword(palavra)) continue // elimina stopwords

        // elimina caracteres proibidos
        let charsFiltrados = palavra.split('').filter(char => ( 
            !proibidos.includes(char)
        ))
        let palavraFiltrada = charsFiltrados.join('')

        if(palavraFiltrada != "") palavrasComFrequencias.push(palavraFiltrada)
    }
    
    return palavrasComFrequencias
}

// metodo para verificar se string é URL ou não
const eUmaURL = str => {

    let eRegular = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi)

    return str.match(eRegular) ? true : false
}

// criaLibOntoPTEmArquivoJson() // descomentar apenas para regerar lib em json

exports.frequencias = geraListaDeFrequenciasDasPalavras
exports.atomizador = atomizador
exports.ontopt = carregaOntoPT
exports.sentimento = sentimentoDaPalavra
