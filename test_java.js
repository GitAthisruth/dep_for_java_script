import { readFileSync } from "fs";
import { basename } from "path";
import { parseModule } from "esprima";

function getImports(filePath) {
    console.log(`Checking file path: ${filePath}`);
    let fileImports = [];

    const fileContent = readFileSync(filePath, "utf-8");
    const fileName = basename(filePath, ".js");

    try {
        const ast = parseModule(fileContent, { sourceType: "module" });

        ast.body.forEach(node => {
            if (node.type === "ImportDeclaration") {
                fileImports.push({
                    file_name: fileName,
                    imports: [node.source.value]
                });
            }
        });
    } catch (error) {
        console.error(`Error parsing ${filePath}:`, error);
    }

    return fileImports;
}

// Example usage:
const filePath = "C:\\Users\\LENOVO\\Desktop\\JSAPP\\dep_for_java_script\\test\\script2.js";  // Test with a single file
console.log(getImports(filePath));
