import { readFileSync } from 'fs';


const rawData = readFileSync('all_file_paths.json', 'utf-8');

const jsonData = JSON.parse(rawData);
jsonData.file_path.forEach(filePath => {
    console.log(`File Path: ${filePath}`);
});