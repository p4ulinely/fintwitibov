// const fs = require('fs')

// let arr = []

// fs.readFile('file.txt', (err, data) => {
//     if (err) throw err
//     arr = listaMaisFrequentes(data.toString())
//     console.log(arr) //resultado final: um array de objetos com o token e sua frequencia
// })

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
        let qnt = listaTokens.filter(t => t === token).length
        tokensUnicosFrequencia.push({
            't': token,
            'f': qnt
        })
    }

    return tokensUnicosFrequencia
}

const atomizar = frase => {
    const proibidos = [';', ':', '.', ',', '', '(', ')', '{', '}', '[', ']']
    let temp = []
    
    frase.split(' ').forEach(palavra => {
        palavra = palavra.toLowerCase()
        let charsFiltrados = palavra.split('').filter(char => !proibidos.includes(char))
        let palavraFiltrada = charsFiltrados.join('')
        if(palavraFiltrada != '') temp.push(palavraFiltrada)
    })
    
    return temp
} 

module.exports = listaMaisFrequentes
// exports.tokenize = atomizar
