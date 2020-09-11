function novoCabecalho(headerAntigo) {

    const novoHeader = {
        "data": "data",
        "último": "ultimo",
        "abertura": "abertura",
        "máxima": "maxima",
        "mínima": "minima",
        "vol.": "volume",
        "var%": "variacao" 
    }

    for (let novo of Object.keys(novoHeader)) {
       if (headerAntigo.indexOf(novo) != -1) return novoHeader[novo]
    }    

    return headerAntigo
}


// FROM https://gist.github.com/johannesjo/6b11ef072a0cb467cc93a885b5a1c19f 
function tableToJson(table) {

    let data = []

    // first row needs to be headers
    let headers = []
    for (let i=0; i<table.rows[0].cells.length; i++) {
        let novoHeader = novoCabecalho(
            table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi,'')
        )
        headers[i] = novoHeader 
    }

    // go through cells
    for (let i=1; i<table.rows.length; i++) {

        let tableRow = table.rows[i]
        let rowData = {}

        for (let j=0; j<tableRow.cells.length; j++) {
            rowData[headers[j]] = tableRow.cells[j].innerHTML
        }
        data.push(rowData)
    }       

    return data
}

const tryToFloat = str => {
    const num = parseFloat(str)

    return isNaN(num) ? 0 : num
}

exports.tryToFloat = tryToFloat
exports.ttoj = tableToJson
