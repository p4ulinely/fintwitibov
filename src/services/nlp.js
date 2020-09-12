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

        for(let key of Object.keys(lib)){
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

const lerArquivoJson = endereco => {
    try {

        const data = fs.readFileSync(`${endereco}`, {encoding:'utf8', flag:'r'})

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
    
    let endereco = "/Users/paulinelymorgan/git/fintwit/src/services/lib-resumida_onto-pt.json"
    return lerArquivoJson(endereco)
}

// retorna sentimento da palavra passada, de acordo com a lib passada
const sentimentoDaPalavra = (lib, palavra) => {

    let neg = lib["-1"].indexOf(palavra)
    let neu = lib["0"].indexOf(palavra)
    let pos = lib["1"].indexOf(palavra)

    sentimento = null

    if(neg != -1 || neu != -1 || pos != -1){
        sentimento = 0

        if(neg != -1) sentimento += -1
        if(pos != -1) sentimento += 1
    }
    
    return sentimento
}

// retorna sentimento da frase passada
// (valor < 0: negativo, valor > 0: positivo, 0: neutro)
const sentimentoDaFrase = frase => {

    const lib = carregaOntoPT()
    const listaFrequencias = geraListaDeFrequenciasDasPalavras(frase)

    // console.log(listaFrequencias)
   
    // atribui sentimento a palavra, caso ela seja valida
    for(let key of Object.keys(listaFrequencias)){
        let s = sentimentoDaPalavra(lib, key)

        if(s != null){

            // multiplica a quantidade pelo sentimento
            let soma = s * listaFrequencias[key] 

            // substitui a quantidade pelo sentimento final da palavra
            listaFrequencias[key] = soma
        } else {
            listaFrequencias[key] = s 
        } 
    }

    let sentimentoFinal = 0
    let controle = false

    for(let key of Object.keys(listaFrequencias)){

        if(listaFrequencias[key] != null){
            controle = true
            sentimentoFinal += listaFrequencias[key]
        } 
    }

    // console.log(listaFrequencias)

    return controle ? parseInt(sentimentoFinal) : null
}

// metodo que retorna frase como objeto de palavrasatomização e suas respectivas frequencias
const geraListaDeFrequenciasDasPalavras = frase => {

    const listaTokens = []
    const listaTokensUnicos = new Set()
    const tokensUnicosFrequencia = {}
    let linhas = frase.split('\n')

    for(let linha of linhas){
        let tokens = atomizador(linha)

        for(let t of tokens){
            listaTokens.push(t)
            listaTokensUnicos.add(t)   
        }
    }

    for(let token of listaTokensUnicos){
        let qnt = listaTokens.filter(t => t == token).length

        tokensUnicosFrequencia[token] = qnt
    }

    return tokensUnicosFrequencia
}

// metodo para atomizador frases em palavras e suas respectivas frequencias
const atomizador = frase => {

    const proibidos = [';', ',', '.', ':', '(', ')', '{', '}', '[', ']', '…', '!', '?', '\n', 'º', '+', '-']
    let palavrasAtomizadas = []
    
    frase = frase.split(' ')

    for(let i = 0; i < frase.length; i++){
        let palavra = frase[i].toLowerCase()
      
        if(!isNaN(parseInt(palavra))) continue // elimina numeros
        if(palavra.length < 2) continue // elimina letras
        if(eUmaURL(palavra)) continue // elimina urls
        if(palavra.indexOf('@') != -1) continue // elimina mencoes
        if(sw.stopword(palavra)) continue // elimina stopwords

        // elimina caracteres proibidos
        let charsFiltrados = palavra.split('').filter(char => ( 
            !proibidos.includes(char)
        ))
        let palavraFiltrada = charsFiltrados.join('')

        if(palavraFiltrada != "") palavrasAtomizadas.push(palavraFiltrada)
    }
    
    return palavrasAtomizadas
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
exports.sentipa = sentimentoDaPalavra
exports.sentifr = sentimentoDaFrase
