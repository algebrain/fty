import ftyUtils from './index';
import * as path from 'path';
import * as fs from 'fs';

const { packDirectory, toYaml } = ftyUtils;

// Парсинг аргументов командной строки
const args = process.argv.slice(2);

const ftyPack = () => {
  if (args.length === 0 || args[0] === '-h' || args[0] === '--help') {
    console.log(`
      Usage: node fty-pack.js <directory_path> [options]

      Options:
        -o, --output <file>    Output FTY file path (default: <directory_name>.fty.yaml)
        -i, --ignore <patterns>  Comma-separated list of patterns to ignore (e.g., "node_modules,dist")
        --gitignore            Use .gitignore file for ignore patterns
        -h, --help             Show this help message
    `);
    process.exit(0);
  }

  const directoryPath = path.resolve(args[0]);
  let outputPath: string | undefined;
  let ignorePatterns: string[] = [];
  let useGitignore = false;

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '-o':
      case '--output':
        outputPath = path.resolve(args[++i]);
        break;
      case '-i':
      case '--ignore':
        ignorePatterns = args[++i].split(',').map(p => p.trim()).filter(p => p.length > 0);
        break;
      case '--gitignore':
        useGitignore = true;
        break;
      default:
        console.warn(`Unknown option: ${arg}. Ignoring.`);
    }
  }

  if (!fs.existsSync(directoryPath) || !fs.statSync(directoryPath).isDirectory()) {
    console.error(`Error: Directory not found or is not a directory: ${directoryPath}`);
    process.exit(1);
  }

  const defaultOutputFileName = `${path.basename(directoryPath)}.fty.yaml`;
  outputPath = outputPath || path.join(process.cwd(), defaultOutputFileName);

  console.log(`Packing directory: ${directoryPath}`);
  console.log(`Output to: ${outputPath}`);
  if (ignorePatterns.length > 0) {
    console.log(`Ignoring patterns: ${ignorePatterns.join(', ')}`);
  }
  if (useGitignore) {
    console.log(`Using .gitignore`);
  }

  try {
    const packedContent = packDirectory(directoryPath, {
      ignore: ignorePatterns,
      useGitignore: useGitignore
    });
    const yamlString = toYaml(packedContent);
    fs.writeFileSync(outputPath, yamlString, 'utf8');
    console.log('Packing complete successfully!');
  } catch (error: any) {
    console.error(`Error during packing: ${error.message}`);
    process.exit(1);
  }
};

ftyPack();