## FileTree YAML (FTY)

**Overview**

FileTree YAML (FTY) is a human-readable, hierarchical data format designed for representing file systems. It leverages standard YAML structures to describe files and directories, allowing for easy serialization and deserialization of entire project structures or individual folders.

**Core Principles**

Every element within the file system (whether a file or a folder) is represented as a **YAML object** (equivalent to a JSON object) with two mandatory fields:

1.  **`name`** (string): The name of the file or folder.
2.  **`data`** (string or array):
      * If the element is a **file**, the `data` field contains a **string** with the complete content of that file.
      * If the element is a **folder** (directory), the `data` field contains an **array** of YAML objects. Each object in this array represents a nested file or folder, following the same FTY structure.

**Example Structure**

```yaml
- name: root-folder
  data:
    - name: file1.txt
      data: This is the content of the first file.
    - name: sub-folder
      data:
        - name: file2.js
          data: |
            console.log("Hello from file2.js");
        - name: empty-folder
          data: [] # An empty folder
```

**Features and Recommendations**

  * **Encoding:** UTF-8 is recommended for file contents and names.
  * **Empty Folders:** Empty folders are represented by a `data` array with zero elements (`[]`).
  * **Multiline Content:** For files with multiline content, it's recommended to use YAML block style indicators (e.g., `|` for a literal block, `>` for a folded block) to improve readability.
  * **Root Element:** The root of an FTY document is typically an array containing one or more top-level objects, representing root folders or files.