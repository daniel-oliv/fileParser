const fs = require('fs');

FileManager = function(){
}

FileManager.saveFile = function(name, type, content)
{   console.log("saveFile");
    // console.log("name", name);
    // console.log("type", type);
    // console.log("content", content);
    fs.writeFile('name.'+type, content, 'utf8', (err) => {
        if (err) throw err;
        console.log('The file ' + name + ' has been saved!');
    });
}

FileManager.saveCSV = function(nameFile, csvMapObj, keys)
{
    FileManager.saveFile(nameFile, "csv", FileManager.getStrCSVToSave(csvMapObj, keys));
}

FileManager.getStrCSVToSave = function(csvMapObj, keys)
{
    let lastKey = keys[keys.length-1];
    let firstKeys = keys.slice(0,keys.length-1)
    let content = keys.join(",")+"\r\n";
    for (const dataRow of csvMapObj) {
        for (const key of firstKeys) {
            if(dataRow[key]) content += dataRow[key];
            //else {console.log("key [" + key + "] not found for row: ", dataRow);}
            content += ",";
        }
        if(dataRow[lastKey]) content += dataRow[lastKey];
        //else{console.log("key [" + lastKey + "] not found for row: ", dataRow);}
        content+= "\r\n";
    }
    return content;
}

FileManager.appendColumn = function(sourceData, destinyData, keysToAdd, matchFunction)
{
    let countMatch = 0;
    console.log("FileManager.appendColumn sourceData", sourceData);
    console.log("FileManager.appendColumn destinyData", destinyData);
    console.log("FileManager.appendColumn keys", keysToAdd);
    for (const newData of sourceData) {
        for (const data of destinyData) {
            /// just two equal signs, since the data may have been parsed to number with d[key]=+d[key]
            if(matchFunction(newData, data))
            {
                //console.log("Data matched.");
                for (const key of keysToAdd) {
                    data[key] = newData[key];
                }
                /// for every data matched
                countMatch++;
                //!and go next since the current data was already found
                break;
            }
        }
    }
    console.log("FileManager: appendColumn - countMatch ", countMatch);
}

FileManager.appendFiles = function(paths, fileName)
{
    let allData = [];

    let promisses = [];

    for (const path of paths) {
        promisses.push(d3.csv(path));
    }    

    Promise.all(promisses).then(function(separateData){
        console.log("FileManager.appendFiles - data", separateData);
        for (const table of separateData) {
            for (const row of table) {
                allData.push(row);
            }
        }
        FileManager.saveCSV(fileName, allData);
        
    }).catch(error=>{
        console.log("FileManager.appendFiles - Erro ao ler os arquivos: ", error);
    });
}




////////////// funções personalizadas para os dados
FileManager.getRevenueData = function(regionsJSON)
{
    let paths = [] ;
    for (const region of regionsJSON) {
        paths.push("data/Receitas"+region.nome+'.csv');
    }
    console.log("mountRevenueFile.mountRevenueFileNames paths", paths);
    FileManager.appendFiles(paths, "Receitas");

}

////////////// funções personalizadas para os dados
FileManager.appendRevenueData = function()
{

    let expAndIDHMNameFile = "data/ExpensesAndIDHMs.csv";
    let revenuesNameFile = "data/Receitas.csv";
    let outputName = "ExpensesRevenuesAndIDHM";
    let _keys = ["Receita Total","Receitas Correntes","IPTU","ITBI","ISS","Transferências Correntes","Transferências da União","FPM","ITR","SUS Fundo a Fundo - União","FNAS","FNDE","Transferências dos Estados"] ;
    //let keys = ["Receita Total","Receitas Correntes","IPTU","ITBI","ISS","Transferências Correntes","Transferências da União","FPM","Transferências dos Estados"] ;
    //let keys = ["Receita Total","Receitas Correntes","IPTU","ITBI","ISS"] ;

    let promisses = [];
    promisses.push(d3.csv(revenuesNameFile));   
    promisses.push(d3.csv(expAndIDHMNameFile)); 

    Promise.all(promisses).then(function([revenuesData, expensesAndIDHMData]){
        console.log("FileManager.appendFiles - revenuesData", revenuesData);
        FileManager.appendColumn(revenuesData, expensesAndIDHMData, 
                                    _keys, (a,b)=>{return a.id==b.id;} );
        FileManager.saveCSV(outputName, expensesAndIDHMData);
        
    }).catch(error=>{
        console.log("FileManager.appendFiles - Erro ao ler os arquivos: ", error);
    });

    
}

module.exports = FileManager;

//// chamadas retiradas do arquivo main.js

//FileManager.saveCSV("teste", citesExpensesData);

    //! getting the idhm data
    // console.log("idhData ", idhData)
    // FileManager.appendColumn(idhData, citesExpensesData, 
    //     ["IDHM 2010", "IDHM Educação 2010", "IDHM Longevidade 2010", "IDHM Renda 2010"], (a,b)=>{return a.id==b.id.toString().slice(0,6);} );
    // FileManager.saveCSV("ExpensesAndIDHMs", citesExpensesData);
    
    //! putting revenue data in one File
    //FileManager.getRevenueData(regionsJSON);

    //! getting the revenue data
    //FileManager.appendRevenueData();
