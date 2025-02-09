import os
import logging
import json

folderPath = "C:\\Users\\LENOVO\\Desktop\\JSAPP\\dep_for_java_script\\test"

def dependency_check(folderpath): 
    all_file_path = []
    all_files = []
    for (dirpath,dirnames, filenames) in os.walk(folderpath):
                for file in filenames:
                    if file.endswith(".js"):
                        all_files.append(file)  
                        file_path = os.path.join(dirpath, file)
                        print(f"file is:{file} and file_path is: {file_path}")
                        all_file_path.append(file_path)
    file_path_list_json = json.dumps({"file_path":all_file_path}, indent=4)
    with open(f"all_file_paths.json", "w") as outfile:
        outfile.write(file_path_list_json)
    
    return file_path_list_json

print(dependency_check(folderPath))