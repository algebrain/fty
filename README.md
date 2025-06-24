-----

# FTY Utilities

## Introduction

**FTY Utilities** is a set of TypeScript tools designed to pack and unpack directory structures into a custom, human-readable YAML-based format called **FileTree YAML (FTY)**. This format makes it easy to serialize and deserialize entire project structures or individual folders, offering a clear, hierarchical representation of your file system.

---

## Motivation: Bridging Projects to LLMs

In the era of large language models (LLMs), the ability to seamlessly integrate and analyze entire codebases or project structures becomes increasingly valuable. Traditional methods of copying and pasting code snippets are insufficient for complex projects. FTY Utilities addresses this by providing a compact and structured way to represent an entire project, including its directory hierarchy and file contents, within a single YAML file.

This format is ideal for:

* **Context for LLMs:** Providing a comprehensive view of a project to an LLM, enabling it to understand context, dependencies, and overall architecture for better code generation, refactoring, or bug detection.
* **Version Control for LLMs:** Effectively "versioning" project snapshots that can be fed into an LLM, allowing for more consistent and reproducible interactions.
* **Sharing and Archiving:** Easily sharing a complete project structure in a single, human-readable file, or archiving project states in a compact format.

By converting complex directory structures into a streamlined FTY representation, we empower LLMs to work with entire projects, not just isolated files, unlocking new possibilities for AI-assisted development.

---

## FTY Format Specification

The core of these utilities is the FTY format itself. You can find detailed specifications of the FTY format in both English and Russian:

  * **English Specification:** [https://rentry.co/65dfo4ed](https://rentry.co/65dfo4ed)
  * **Russian Specification:** [https://rentry.co/2w6nz67k](https://rentry.co/2w6nz67k)

-----

## Features

  * **Pack Directories:** Convert a physical directory into an FTY-formatted YAML string or file.
  * **Unpack FTY:** Reconstruct a physical directory from an FTY-formatted YAML string or file.
  * **Flexible Ignoring:** Specify files and folders to ignore during packing using custom patterns.
  * **`.gitignore` Support:** Automatically integrate `.gitignore` rules for seamless project packing.
  * **Compact & Readable Code:** Written in TypeScript, favoring arrow functions and object-returning functions for clean, maintainable code.

-----

## Installation

1.  **Clone the repository** (or copy the `src` folder content into your project).
2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn add
    ```

-----

## Usage

### Build the Utilities

First, compile the TypeScript source files:

```bash
npm run build
# or
npx tsc
```

This will create `dist` directory with compiled JavaScript files.

### Packing a Directory

Use the `fty-pack` script to convert a directory into an FTY YAML file.

```bash
npm run fty-pack <directory_path> [options]
```

**Options:**

  * `<directory_path>`: The path to the directory you want to pack. This is the **only required argument**.
  * `-o, --output <file>`: Specifies the output FTY file path. If omitted, the default is `<directory_name>.fty.yaml` in the current working directory.
  * `-i, --ignore <patterns>`: A comma-separated list of patterns (e.g., `"node_modules,dist"`) to ignore during packing. These patterns are relative to the `<directory_path>`.
  * `--gitignore`: If present, the packer will read the `.gitignore` file in the `<directory_path>` and apply its rules. The `.gitignore` file itself will be ignored.
  * `-h, --help`: Display the help message.

**Examples:**

  * Pack a directory named `my-project` into `my-project.fty.yaml`:
    ```bash
    npm run fty-pack my-project
    ```
  * Pack `my-project`, ignoring `node_modules` and `dist` folders, and using `.gitignore` rules, saving to `output.yaml`:
    ```bash
    npm run fty-pack my-project -i node_modules,dist --gitignore -o output.yaml
    ```

### Unpacking an FTY File

Use the `fty-unpack` script to reconstruct a directory from an FTY YAML file.

```bash
npm run fty-unpack <fty_file_path> [options]
```

**Options:**

  * `<fty_file_path>`: The path to the FTY YAML file you want to unpack. This is the **only required argument**.
  * `-o, --output <directory>`: Specifies the target directory for unpacking. If omitted, the default is `unpacked_<file_name_without_ext>` in the current working directory (e.g., `unpacked_my_project`).
  * `-h, --help`: Display the help message.

**Example:**

  * Unpack `my_project.fty.yaml` into a new folder named `reconstructed_project`:
    ```bash
    npm run fty-unpack my_project.fty.yaml -o reconstructed_project
    ```

-----

## Development & Contribution

Feel free to explore the `src/index.ts` file for the core `packDirectory` and `unpackDirectory` logic. Contributions, bug reports, and feature requests are welcome\!

-----