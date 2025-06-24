-----

# FTY Utilities

## Introduction

**FTY Utilities** is a set of TypeScript tools designed to pack and unpack directory structures into a custom, human-readable YAML-based format called **FileTree YAML (FTY)**. This format makes it easy to serialize and deserialize entire project structures or individual folders, offering a clear, hierarchical representation of your file system.

---

## Motivation: Bridging Projects to LLM Chats

In the evolving landscape of large language models (LLMs), effectively communicating an entire project's context is crucial, especially when working directly within **LLM chat interfaces**. Copying and pasting individual files one by one into a chat is cumbersome, error-prone, and often leads to an incomplete understanding by the AI.

FTY Utilities offers an elegant solution to this challenge by providing a **single, human-readable YAML representation of your entire project's structure and content**. For **small to medium-sized projects**, this means you can:

* **Provide Full Context with Ease:** Instead of manually assembling bits and pieces, simply pack your project into an FTY file and paste its YAML content directly into an LLM chat. This gives the AI immediate access to the complete file hierarchy, individual file contents, and even `.gitignore` rules, allowing for a much deeper and more accurate understanding of your codebase.
* **Enhance AI Understanding and Output:** With comprehensive context, LLMs can perform better code reviews, generate more relevant code snippets, identify dependencies, suggest refactoring, or even help debug issues within the project's ecosystem.
* **Streamline Iteration:** Quickly pack, paste, get AI feedback, make changes, and repeat. This speeds up the development cycle by reducing the friction of context switching and manual data transfer.
* **Facilitate Sharing:** Share an entire project's snapshot in a single, versionable text file, which can then be easily consumed by another developer or directly by an LLM.

FTY effectively transforms a complex directory into a manageable, shareable, and AI-consumable text block, making your interactions with LLM chat interfaces significantly more productive and powerful.

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