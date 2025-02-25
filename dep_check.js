import promptSync from "prompt-sync";
import {file_path_finder} from "./file_path_finder.js";
import {finding_getimports} from "./finding_getimports.js"
import {writeFileSync } from "fs";

const prompt = promptSync();

const folderPath = "C:\\Users\\LENOVO\\Desktop\\JSAPP\\dep_for_java_script\\test2\\reveal.js";

const rawData = file_path_finder(folderPath);
const files_inform = finding_getimports(rawData);
function depSearch(file_to_check, files_inform, visited = new Set(), dependencies = new Set()) {
    visited.add(file_to_check);
    files_inform.forEach(file_info => {
        if (file_info.imports.includes(file_to_check)) {
            dependencies.add(file_info.file);
        }
    });

    dependencies.forEach(imp_file => {
        if (!visited.has(imp_file)) {
            const new_dependencies = depSearch(imp_file, files_inform, visited, dependencies);
        }
    });

    return dependencies;
}

const file_to_check = prompt("Enter the file name to check dependencies: ");

const dependencies = depSearch(file_to_check, files_inform);

let parsedData;
try {
    parsedData = JSON.parse(rawData);  
} catch (error) {
    console.error("Error parsing rawData:", error);
}


const getFilePath = (fileName) => {
    const file = parsedData?.all_file_path.find(item => item.file === fileName);
    return file ? file.filePath : null;
};


const dependenciesWithPaths = {
    file_to_check:file_to_check,
    file_to_check_path: getFilePath(file_to_check),
    dependencies: Array.from(dependencies).map(dep => ({
        file: dep,
        path: getFilePath(dep),
    }))
};

const outputFilePath = `${file_to_check}_dep_file_paths.json`;  
    const jsonDataw = JSON.stringify(dependenciesWithPaths, null, 2); 
    try {
        writeFileSync(outputFilePath,jsonDataw, "utf8");
        console.log("File imports saved successfully to fileImports.json");
    } catch (error) {
        console.error("Error saving JSON file:", error);
    }

console.log("dependencies with paths", dependenciesWithPaths);





