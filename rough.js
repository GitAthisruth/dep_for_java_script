import { readFileSync, writeFileSync } from "fs";
import { basename } from "path";
import { parseModule, parseScript } from "meriyah"; 
import promptSync from "prompt-sync";
import { file_path_finder } from "./file_path_finder.js";

const prompt = promptSync();
export function finding_getimports(rawData) {
    const jsonData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
    // console.log(`jsonData: ${jsonData}`)
    let fileImports = [];
    let all_files = [];

    jsonData.all_file_path.forEach(file_names => {
        if (file_names && file_names.filePath && file_names.filePath.endsWith(".js")) {
            const fileContent = readFileSync(file_names.filePath, "utf-8");
            // console.log("file.filePath:", file_names.filePath);

            const fileName = basename(file_names.file, ".js");
            all_files.push(fileName);

   
            let ast;
            try {
                ast = parseModule(fileContent, { sourceType: "module" });
            } catch (moduleError) {
                console.warn(`Module parsing failed for ${file_names.filePath}, trying script mode.`);
                ast = parseScript(fileContent, { sourceType: "script" });
            }

           
            let imports = ast.body
                .filter(node => node.type === "ImportDeclaration")
                .map(node => cleanImportName(node.source.value));

            let requires = ast.body
                .filter(node => node.type === "VariableDeclaration" && 
                    node.declarations.some(decl =>
                        decl.init && 
                        decl.init.type === "CallExpression" &&
                        decl.init.callee.name === "require"
                    )
                )
                .map(node => cleanImportName(node.declarations[0].init.arguments[0].value));

          
            fileImports.push({
                file: file_names.file,
                imports: [...imports, ...requires] 
            });
        }
    });

  
    const outputFilePath = "fileImports.json";  
    const jsonDataw = JSON.stringify(fileImports, null, 2); 
    try {
        writeFileSync(outputFilePath, jsonDataw, "utf8");
        console.log("File imports saved successfully to fileImports.json");
    } catch (error) {
        console.error("Error saving JSON file:", error);
    }

    return fileImports;
}


function cleanImportName(importName) {
    if (!importName) return null;

    if (importName.startsWith("./")) {
        importName = importName.substring(2);
    }
    if (importName.endsWith(".js")) {
        importName = importName.slice(0, -3);
    }
    if (importName.includes("/")) {
        importName = importName.split("/").pop();
    }

    return importName; 
}

// const rawData = {
//     "file_path": [
//         {
//             "file": "script1",
//             "filePath": "C:\\Users\\LENOVO\\Desktop\\JSAPP\\dep_for_java_script\\test\\script1.js"
//         },
//         {
//             "file": "script2",
//             "filePath": "C:\\Users\\LENOVO\\Desktop\\JSAPP\\dep_for_java_script\\test\\script2.js"
//         },
//         {
//             "file": "script3",
//             "filePath": "C:\\Users\\LENOVO\\Desktop\\JSAPP\\dep_for_java_script\\test\\script3.js"
//         },
//         {
//             "file": "script4",
//             "filePath": "C:\\Users\\LENOVO\\Desktop\\JSAPP\\dep_for_java_script\\test\\test2\\script4.js"
//         },
//         {
//             "file": "utils",
//             "filePath": "C:\\Users\\LENOVO\\Desktop\\JSAPP\\dep_for_java_script\\test\\utils.js"
//         }
//     ]
// }

const folderPath = "C:\\Users\\LENOVO\\Desktop\\JSAPP\\dep_for_java_script\\test2\\reveal.js";

const rawData = file_path_finder(folderPath);

// console.log(`rawData:${rawData}`);
// console.log(typeof rawData);

const files_inform = finding_getimports(rawData);

// console.log("file_inform", files_inform);

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

const result = { file_to_check: file_to_check, dependencies: Array.from(dependencies) };

let parsedData;
try {
    parsedData = JSON.parse(rawData);  // Parse string to object
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

