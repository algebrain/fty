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

**In your project where you want to use FTY Utilities:**

1.  **Install FTY Utilities** as a development dependency:
    ```bash
    npm install --save-dev fty-utils
    # or
    pnpm add --save-dev fty-utils
    ```

-----

## Usage

### Configure Your `package.json`

Add `fty-pack` and `fty-unpack` scripts to your project's `package.json` for easy access:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "fty-pack": "fty-pack . -o package.fty.yaml --gitignore -i node_modules,dist",
    "fty-unpack": "fty-unpack package.fty.yaml -o ."
  },
  "devDependencies": {
    "fty-utils": "^1.0.0"
  }
}
```
* The `fty-pack` script will pack the current directory (`.`) into `package.fty.yaml`, ignoring typical development artifacts (`node_modules`, `dist`), and respecting `.gitignore` rules.
* The `fty-unpack` script will unpack `package.fty.yaml` back into the current directory.

### Packing a Directory

From your project's root directory:

```bash
npm run fty-pack
# or
pnpm run fty-pack
```

You can also use `npx` (or `pnpm dlx`) to run the commands directly without defining them in `package.json` scripts:

```bash
npx fty-pack <directory_path> [options]
# Example: npx fty-pack . -o my_project.fty.yaml --gitignore -i node_modules,dist
```

**CLI Options for `fty-pack`:**

* `<directory_path>`: The path to the directory you want to pack. This is the **only required argument**.
* `-o, --output <file>`: Specifies the output FTY file path. If omitted, the default is `<directory_name>.fty.yaml` in the current working directory.
* `-i, --ignore <patterns>`: A comma-separated list of patterns (e.g., `"node_modules,dist"`) to ignore during packing. These patterns are relative to the `<directory_path>`.
* `--gitignore`: If present, the packer will read the `.gitignore` file in the `<directory_path>` and apply its rules. The `.gitignore` file itself will be ignored.
* `-h, --help`: Display the help message.

### Unpacking an FTY File

From your project's root directory:

```bash
npm run fty-unpack
# or
pnpm run fty-unpack
```

Or using `npx` (or `pnpm dlx`):

```bash
npx fty-unpack <fty_file_path> [options]
# Example: npx fty-unpack package.fty.yaml -o .
```

**CLI Options for `fty-unpack`:**

* `<fty_file_path>`: The path to the FTY YAML file you want to unpack. This is the **only required argument**.
* `-o, --output <directory>`: Specifies the target directory for unpacking. If omitted, the default is `unpacked_<file_name_without_ext>` in the current working directory (e.g., `unpacked_my_project`).
* `-h, --help`: Display the help message.

-----

## Development of `fty-utils`

If you are developing `fty-utils` itself:

1.  **Clone the repository.**
2.  **Install dependencies:** `npm install` (or `pnpm install`).
3.  **Build the utilities:** `npm run build` (or `npx tsc`). This will compile the TypeScript source files in `src/` into JavaScript files in `dist/`.
4.  **Run tests:** `npm run test`.

Feel free to explore the `src/index.ts` file for the core `packDirectory` and `unpackDirectory` logic. Contributions, bug reports, and feature requests are welcome!

-----
