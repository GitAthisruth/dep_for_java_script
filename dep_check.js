import promptSync from "prompt-sync";
import {file_path_finder} from "./file_path_finder.js";
import {finding_getimports} from "./finding_getimports.js"
import {writeFileSync } from "fs";

const prompt = promptSync();

function depSearch(fileToCheck, importData,rawData,visited = new Set(), tupledDependencies = new Set()) {
    console.log("importData",importData)
    visited.add(fileToCheck);
    let dependencies = new Set();


    importData.forEach(fileInfo => {
        if (fileInfo.imports.includes(fileToCheck)) {
            dependencies.add(fileInfo.file);
        }
    });
    let result = Array.from(dependencies).map(item => [fileToCheck, item]);
    result.forEach(dep => tupledDependencies.add(dep));


    for (let impFile of dependencies) {
        if (!visited.has(impFile)) {
            let [newDep, newTuple] = depSearch(impFile, importData, visited, tupledDependencies);
            newDep.forEach(dep => dependencies.add(dep));
        }
    }
    const dependenciesArray = Array.from(dependencies);

const jsonData = JSON.stringify(
    { file_to_check:fileToCheck, dependencies: dependenciesArray },
    null,
    4
);

writeFileSync(`${fileToCheck}_dependencies.json`, jsonData, "utf-8");

    return [Array.from(dependencies), Array.from(tupledDependencies)];
}





const folderPath = "C:\\Users\\LENOVO\\Desktop\\JSAPP\\dep_for_java_script\\test2\\reveal.js"

const rawData = file_path_finder(folderPath)

const importData = finding_getimports(rawData);  
const fileToCheck = prompt("Enter the file name to check dependencies: ");


if (typeof fileToCheck === "string") {
    let [dependencies, tupledDependencies] = depSearch(fileToCheck, importData,rawData);
    console.log("Dependencies (List of Files):", dependencies);
    console.log("Tupled Dependencies (List of Tuples):", tupledDependencies);
} else {
    console.error("Invalid file name provided:", fileToCheck);
}