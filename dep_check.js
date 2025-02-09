import { getImports } from './test_java.js'; 
import { readFileSync } from "fs";


function depSearch(fileToCheck, importData, visited = new Set(), tupledDependencies = new Set()) {
    console.log("importData", importData);

    visited.add(fileToCheck);
    let dependencies = new Set();

    // Find files that import `fileToCheck`
    // importData.forEach(fileInfo => {
    //     let normalizedFile = fileToCheck.replace(".js", "");
    //     if (fileInfo.imports.includes(normalizedFile)) {
    //         dependencies.add(fileInfo.file_name);
    //     }
    // });

    // Store dependencies as tuples
    let result = Array.from(dependencies).map(item => [fileToCheck, item]);
    result.forEach(dep => tupledDependencies.add(dep));

    // Recursive search for dependencies
    for (let impFile of dependencies) {
        if (!visited.has(impFile)) {
            let [newDep, newTuple] = depSearch(impFile, importData, visited, tupledDependencies);
            dependencies = new Set([...dependencies, ...newDep]); // Merge dependencies
        }
    }

    return [Array.from(dependencies), Array.from(tupledDependencies)];
}

// Read JSON file
const rawData = readFileSync("all_file_paths.json", "utf-8");



let fileToCheck = "utils.js";

if (fileToCheck) {
    console.log(depSearch(fileToCheck, getImports(rawData)));
} else {
    console.log("Invalid file name.");
}
