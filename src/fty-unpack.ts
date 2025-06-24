#!/usr/bin/env node
import { unpackDirectory, fromYaml } from './index'; // Импортируем из index
import * as path from 'path';
import * as fs from 'fs';

const args = process.argv.slice(2);

const runUnpack = (cliArgs: string[]) => {
  if (cliArgs.length === 0 || cliArgs[0] === '-h' || cliArgs[0] === '--help') {
    console.log(`
      Usage: fty-unpack <fty_file_path> [options]

      Options:
        -o, --output <directory>  Output directory path (default: unpacked_<file_name_without_ext>)
        -h, --help              Show this help message
    `);
    process.exit(0);
  }

  const ftyFilePath = path.resolve(cliArgs[0]);
  let outputPath: string | undefined;

  for (let i = 1; i < cliArgs.length; i++) {
    const arg = cliArgs[i];
    switch (arg) {
      case '-o':
      case '--output':
        outputPath = path.resolve(cliArgs[++i]);
        break;
      default:
        console.warn(`Unknown option: ${arg}. Ignoring.`);
    }
  }

  if (!fs.existsSync(ftyFilePath) || !fs.statSync(ftyFilePath).isFile()) {
    console.error(`Error: FTY file not found or is not a file: ${ftyFilePath}`);
    process.exit(1);
  }

  const fileName = path.basename(ftyFilePath);
  const defaultOutputName = `unpacked_${fileName.split('.').slice(0, -2).join('.') || 'project'}`;
  outputPath = outputPath || path.join(process.cwd(), defaultOutputName);

  console.log(`Unpacking FTY file: ${ftyFilePath}`);
  console.log(`Output to: ${outputPath}`);

  try {
    const yamlString = fs.readFileSync(ftyFilePath, 'utf8');
    const ftyContent = fromYaml(yamlString);

    if (!Array.isArray(ftyContent)) {
      console.error('Error: FTY file content is not a valid FTY structure (expected an array at root).');
      process.exit(1);
    }

    unpackDirectory(ftyContent, outputPath);
    console.log('Unpacking complete successfully!');
  } catch (error: any) {
    console.error(`Error during unpacking: ${error.message}`);
    process.exit(1);
  }
};

runUnpack(args);
