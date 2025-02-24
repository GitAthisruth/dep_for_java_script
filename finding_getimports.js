import { readFileSync, writeFileSync } from "fs";
import { basename } from "path";
import { parseModule, parseScript } from "meriyah"; 

export function finding_getimports(rawData) {
    const jsonData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
    console.log(`jsonData: ${jsonData}`)
    let fileImports = [];
    let all_files = [];

    jsonData.file_path.forEach(file_names => {
        if (file_names && file_names.filePath && file_names.filePath.endsWith(".js")) {
            const fileContent = readFileSync(file_names.filePath, "utf-8");
            console.log("file.filePath:", file_names.filePath);

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