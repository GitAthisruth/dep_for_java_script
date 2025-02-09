import fs from "fs";
import path from "path";


export function file_path_finder(folderPath) {
    let allFilePaths = [];

    function traverseDirectory(dir) {
        const files = fs.readdirSync(dir, { withFileTypes: true });

        files.forEach(file => {
            const filePath = path.join(dir, file.name);

            if (file.isDirectory()) {
                traverseDirectory(filePath); 
            } else if (file.name.endsWith(".js")) {
                allFilePaths.push(filePath);
            }
        });
    }

    traverseDirectory(folderPath);

    const filePathListJson = JSON.stringify({ file_path: allFilePaths }, null, 4);

    fs.writeFileSync("all_file_paths.json", filePathListJson, "utf-8");
    return filePathListJson;
}

// console.log(dependencyCheck(folderPath));




