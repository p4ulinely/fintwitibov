function novoCabecalho(headerAntigo) {

    const novoHeader = ["data", "último", "abertura", "máxima", "mínima", "vol.", "var%"]
        
    for (let novo of novoHeader) {
       if (headerAntigo.indexOf(novo) != -1) return novo
    }    

    return headerAntigo
}


// FROM https://gist.github.com/johannesjo/6b11ef072a0cb467cc93a885b5a1c19f 
function tableToJson(table) {
    let data = []

    // first row needs to be headers
    let headers = []
    for (let i=0; i<table.rows[0].cells.length; i++) {
        let novoHeader = novoCabecalho(table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi,''))
        headers[i] = novoHeader 
    }

    // go through cells
    for (let i=1; i<table.rows.length; i++) {

        let tableRow = table.rows[i]
        let rowData = {}

        for (let j=0; j<tableRow.cells.length; j++) {
            rowData[ headers[j] ] = tableRow.cells[j].innerHTML
        }

        data.push(rowData)
    }       

    return data
}

exports.ttoj = tableToJson
