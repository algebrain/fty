import { packDirectory, unpackDirectory, toYaml, fromYaml } from './index'; // Импорт напрямую из index
import * as path from 'path';
import * as fs from 'fs';

const testDir = 'test_project';
const packedFilePath = 'packed_project.yaml';
const unpackedDir = 'unpacked_project';

// Clean up previous test runs
const cleanup = () => {
  if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true, force: true });
  if (fs.existsSync(packedFilePath)) fs.rmSync(packedFilePath, { force: true });
  if (fs.existsSync(unpackedDir)) fs.rmSync(unpackedDir, { recursive: true, force: true });
};

cleanup();

console.log('Creating test project...');
fs.mkdirSync(path.join(testDir, 'src'), { recursive: true });
fs.writeFileSync(path.join(testDir, 'package.json'), JSON.stringify({ name: 'test-project' }, null, 2));
fs.writeFileSync(path.join(testDir, 'src', 'index.ts'), 'console.log("Hello FTY!");');
fs.writeFileSync(path.join(testDir, '.gitignore'), `
# Ignore node_modules
node_modules/
# Ignore temporary files
*.tmp
`);
fs.writeFileSync(path.join(testDir, 'temp.tmp'), 'This is a temporary file.');
fs.mkdirSync(path.join(testDir, 'node_modules'), { recursive: true });
fs.writeFileSync(path.join(testDir, 'node_modules', 'some_module.js'), '// Some module code');


console.log('Packing directory...');
const packed = packDirectory(testDir, { useGitignore: true });
const yamlString = toYaml(packed);
fs.writeFileSync(packedFilePath, yamlString);
console.log(`Directory packed to ${packedFilePath}`);
console.log('Packed content:');
console.log(yamlString);


console.log('Unpacking directory...');
const loadedFty = fromYaml(fs.readFileSync(packedFilePath, 'utf8'));
unpackDirectory(loadedFty, unpackedDir);
console.log(`Directory unpacked to ${unpackedDir}`);

// Basic verification
console.log('\nVerification:');
console.log(`Does ${unpackedDir}/package.json exist?`, fs.existsSync(path.join(unpackedDir, 'package.json')));
console.log(`Does ${unpackedDir}/src/index.ts exist?`, fs.existsSync(path.join(unpackedDir, 'src', 'index.ts')));
console.log(`Does ${unpackedDir}/temp.tmp exist? (Should be false)`, fs.existsSync(path.join(unpackedDir, 'temp.tmp')));
console.log(`Does ${unpackedDir}/node_modules exist? (Should be false)`, fs.existsSync(path.join(unpackedDir, 'node_modules')));

cleanup();
console.log('\nTest complete. Cleaned up.');
