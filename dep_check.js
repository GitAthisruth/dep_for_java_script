import promptSync from "prompt-sync";
import {file_path_finder} from "./file_path_finder.js";
import {finding_getimports} from "./finding_getimports.js"
import {writeFileSync } from "fs";

const prompt = promptSync();

function depSearch(file_to_check,files_inform,visited,dependencies) {
    if (visited === undefined || visited === null) {
    visited = new Set();
    }
    if (dependencies === undefined || dependencies === null) {
    dependencies = new Set();
    }
    visited.add(file_to_check)
    files_inform.forEach(file_info => {
    if (file_info.imports.includes(file_to_check)) {
        dependencies.add(file_info.file);
    }
    dependencies.forEach(imp_file=> {
        if (!visited.has(imp_file)){
            const new_dependencies = depSearch(imp_file, files_inform, visited);
            new_dependencies.forEach(dep => dependencies.add(dep));
        }
    })
});

return dependencies

}
const folderPath = "C:\\Users\\LENOVO\\Desktop\\JSAPP\\dep_for_java_script\\test2\\reveal.js"

const rawData = file_path_finder(folderPath)

console.log(rawData);

const files_inform = finding_getimports(rawData)

const file_to_check = prompt("Enter the file name to check dependencies: ");

const dependencies = depSearch(file_to_check,files_inform);

const result = {file_to_check:file_to_check,dependencies:Array.from(dependencies)} 

const getFilePath = (fileName) => {
    const file = rawData.file_path.find(item => item.file === fileName);
    return file ? file.filePath : null;
};

const fileToCheckPath = getFilePath(result.file_to_check);

const dependenciesWithPaths = result.dependencies.map(dep => ({
    file: dep,
    filePath: getFilePath(dep)
}));

const updatedResult = {
    file_to_check: {
        name: result.file_to_check,
        filePath: fileToCheckPath
    },
    dependencies: dependenciesWithPaths
};

const outputFilePath = `${file_to_check}pathAddedResult.json`;  
    const jsonDataw = JSON.stringify(updatedResult, null, 2); 
    try {
        writeFileSync(outputFilePath, jsonDataw , "utf8");
        console.log("File imports saved successfully to fileImports.json");
    } catch (error) {
        console.error("Error saving JSON file:", error);
    }

console.log(updatedResult);




