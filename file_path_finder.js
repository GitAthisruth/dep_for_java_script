import fs from "fs";
import path from "path";

const folderPath = "C:\\Users\\LENOVO\\Desktop\\JSAPP\\dep_for_java_script\\test2\\reveal.js"


export function file_path_finder(folderPath) {
    let allFilePaths = [];

    function traverseDirectory(dir) {
        const files = fs.readdirSync(dir, { withFileTypes: true });

        files.forEach(file => {
            const filePath = path.join(dir, file.name);

            if (file.isDirectory()) {
                traverseDirectory(filePath); 
            } else if (file.name.endsWith(".js")) {
                const fileName = file.name.replace(/\.js$/, "");
                allFilePaths.push({"file":fileName,"filePath":filePath});
            }
        });
    }

    traverseDirectory(folderPath);

    const filePathListJson = JSON.stringify({ file_path: allFilePaths }, null, 4);

    fs.writeFileSync("all_file_paths.json", filePathListJson, "utf-8");
    return filePathListJson;
}

console.log(file_path_finder(folderPath));




