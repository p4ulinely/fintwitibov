// const fs = require('fs')

// let arr = []

// fs.readFile('file.txt', (err, data) => {
//     if (err) throw err
//     arr = listaMaisFrequentes(data.toString())
//     console.log(arr) //resultado final: um array de objetos com o token e sua frequencia
// })

// metodo que retorna frase como objeto de palavras e suas respectivas frequencias
const listaMaisFrequentes = str => {

    const listaTokens = []
    const tokensUnicos = new Set()
    const tokensUnicosFrequencia = []
    let linhas = str.split('\n')

    for(let linha of linhas){
        let tokens = atomizar(linha)
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

// metodo para atomizar frases em palavras e suas respectivas frequencias
const atomizar = frase => {

    const proibidos = [';', ',', '.', ':', '(', ')', '{', '}', '[', ']']
    let palavrasComFrequencias = []
    
    frase = frase.split(' ')

    for(let i = 0; i < frase.length; i++){

        palavra = frase[i].toLowerCase()
        
        if(eUmaURL(palavra)) continue // elimina urls

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

exports.frequencia = listaMaisFrequentes
// module.exports = listaMaisFrequentes
// exports.tokenize = atomizar
