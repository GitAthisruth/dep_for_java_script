import { readFileSync, writeFileSync } from "fs";
import { basename } from "path";
import { parseModule } from "esprima";
import {file_path_finder} from "./file_path_finder.js";


export function finding_getimports(rawData) {
    const jsonData = JSON.parse(rawData);
    let fileImports = [];

    jsonData.file_path.forEach(filePath => {
        try {
            const fileContent = readFileSync(filePath, "utf-8");
            const fileName = basename(filePath,".js");
            const ast = parseModule(fileContent, { sourceType: "module" });
            let imports = ast.body
                .filter(node => node.type === "ImportDeclaration")
                .map(node => {
                    let importName = node.source.value;
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
                });

            if (imports.length > 0) {
                fileImports.push({
                    file_name: fileName,
                    imports: imports
                });
            }
        } catch (error) {
            console.error(`Error parsing ${filePath}:`, error);
        }
    });

    return fileImports;
}

