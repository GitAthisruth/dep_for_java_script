import { readFileSync } from "fs";
import { basename } from "path";
import { parseModule } from "esprima";



export function getImports(rawData) {
    const jsonData = JSON.parse(rawData);
    console.log("jsonData",jsonData)
    let fileImports = [];

    jsonData.file_path.forEach(filePath => {
        console.log(`Processing File: ${filePath}`);

        try {
            const fileContent = readFileSync(filePath, "utf-8");
            console.log("File Content:", fileContent);
            const fileName = basename(filePath,".js");
            console.log("File Name:", fileName);
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

const filePath = "C:\\Users\\LENOVO\\Desktop\\JSAPP\\dep_for_java_script\\all_file_paths.json";

// Read the JSON file and parse it
const rawData = readFileSync(filePath, "utf-8");

console.log(rawData)

console.log(getImports(rawData));