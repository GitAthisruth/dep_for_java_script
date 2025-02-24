import promptSync from "prompt-sync";
import {file_path_finder} from "./file_path_finder.js";
import {finding_getimports} from "./finding_getimports.js"
import {writeFileSync } from "fs";

const prompt = promptSync();

function depSearch(file_to_check,files_inform,visited) {
    if (visited === undefined || visited === null) {
    visited = new Set();
    }
    visited.add(file_to_check)
    files_inform.forEach(file_info => {
        file_to_check = file_to_check.replace(/\.py$/, "");
    if (file_info.imports.includes(file_to_check)) {
        dependencies.add(file_info.file);
    }
    dependencies.forEach(imp_file=> {
        if (!visited.has(imp_file)){
            const new_dependencies = ff(imp_file, files_inform, visited);
            new_dependencies.forEach(dep => dependencies.add(dep));
        }
    })
});
const dependenciesArray = Array.from(dependencies);

const jsonData = JSON.stringify(
    { file_to_check:fileToCheck, dependencies: dependenciesArray },
    null,
    4
);

writeFileSync(`${fileToCheck}_dependencies.json`, jsonData, "utf-8");

    return jsonData;
}





const folderPath = "C:\\Users\\LENOVO\\Desktop\\JSAPP\\dep_for_java_script\\test2\\reveal.js"

const rawData = file_path_finder(folderPath)

const importData = finding_getimports(rawData);  

const fileToCheck = prompt("Enter the file name to check dependencies: ");


if (typeof fileToCheck === "string") {
    let dependencies= depSearch(fileToCheck, importData,rawData);
    console.log("Dependencies (List of Files):", dependencies);
} else {
    console.error("Invalid file name provided:", fileToCheck);
}