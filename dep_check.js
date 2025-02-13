import { readFileSync } from "fs";
import promptSync from "prompt-sync";
import {file_path_finder} from "./file_path_finder.js";
import {finding_getimports} from "./finding_getimports.js"

const prompt = promptSync();

function depSearch(fileToCheck, importData, visited = new Set(), tupledDependencies = new Set()) {
    visited.add(fileToCheck);
    let dependencies = new Set();


    importData.forEach(fileInfo => {
        let normalizedFile = fileToCheck.replace(".js", "");
        if (fileInfo.imports.includes(normalizedFile)) {
            dependencies.add(fileInfo.file_name);
        }
    });

    
    let result = Array.from(dependencies).map(item => [fileToCheck, item]);
    result.forEach(dep => tupledDependencies.add(dep));


    for (let impFile of dependencies) {
        if (!visited.has(impFile)) {
            let [newDep, newTuple] = depSearch(impFile, importData, visited, tupledDependencies);
            dependencies = new Set([...dependencies, ...newDep]); 
        }
    }

    return [Array.from(dependencies), Array.from(tupledDependencies)];
}



const folderPath = "C:\\Users\\LENOVO\\Desktop\\JSAPP\\dep_for_java_script\\test";

const rawData = file_path_finder(folderPath)

const importData = finding_getimports(rawData);  


const fileToCheck = prompt("Enter the file name to check dependencies: ");


if (typeof fileToCheck === "string" && fileToCheck.trim() !== "") {
    console.log("fileToCheck:", fileToCheck);
    let [dependencies, tupledDependencies] = depSearch(fileToCheck, importData);

    console.log("Dependencies (List of Files):", dependencies);
    console.log("Tupled Dependencies (List of Tuples):", tupledDependencies);
} else {
    console.error("Invalid file name provided:", fileToCheck);
}