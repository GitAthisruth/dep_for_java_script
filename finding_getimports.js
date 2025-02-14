import {readFileSync,writeFileSync } from "fs";
import { basename } from "path";
// import { parseModule } from "esprima";
import { parseModule, parseScript } from "meriyah";

export function finding_getimports(rawData) {
    const jsonData = JSON.parse(rawData);
    let fileImports = [];
    let all_files = []

    jsonData.file_path.filter(filePath => filePath.endsWith(".js")).forEach(filePath => {
        try {
            const fileContent = readFileSync(filePath, "utf-8");
            const fileName = basename(filePath,".js");
            all_files.push(fileName)
            let ast;
            try {
                ast = parseModule(fileContent, { sourceType: "module" });
            } catch (moduleError) {
                console.warn(`Module parsing failed for ${filePath}, trying script mode.`);
                ast = parseScript(fileContent, { sourceType: "script" });
            }
            let imports = ast.body.filter(node => node.type === "ImportDeclaration").map(node => cleanImportName(node.source.value));
            let requires = ast.body.filter(node => node.type === "VariableDeclaration" && node.declarations.some(decl =>decl.init && decl.init.type === "CallExpression" && decl.init.callee.name === "require")).map(node => cleanImportName(node.declarations[0].init.arguments[0].value));
            fileImports.push({
                file: fileName,
                imports: [...imports, ...requires] 
            });

        } catch (error) {
            console.error(`Error processing file ${filePath}:`, error);
        }
    });

    const jsonDataw = JSON.stringify(fileImports, null, 2); 
const filePath = "fileImports.json";  
try {
    writeFileSync(filePath, jsonDataw, "utf8");
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
