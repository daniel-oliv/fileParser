const fs = require('fs');
const path = require("path");
const d3 = require("d3");
const fM = require('./file-manager');

const filePath = path.resolve(__dirname, "./data/Clientes_BT_Torre.csv");

console.log('filePath ' + filePath);

try {
    // let string = (fs.readFileSync(filePath).toString());
    let csvData = d3.csvParse(fs.readFileSync(filePath).toString());
    csvData = csvData.slice(0,2);
    // console.log(csvData);
    fM.saveCSV('teste', csvData, d3.keys(csvData[0]));

} catch (error) {
    console.log('Exception !') 
    console.log(error)  
}



//console.log(text);