import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { Minimatch } from 'minimatch';

  type FTYObject = {
    name: string;
    data: string | FTYObject[];
  };

  type PackOptions = {
    ignore?: string[];
    useGitignore?: boolean;
  };

  const ftyUtils = () => {

    const loadGitignore = (dirPath: string): string[] => {
      const gitignorePath = path.join(dirPath, '.gitignore');
      if (fs.existsSync(gitignorePath)) {
        return fs.readFileSync(gitignorePath, 'utf8')
          .split(/\r?\n/)
          .filter(line => line.trim() !== '' && !line.startsWith('#'));
      }
      return [];
    };

    const shouldIgnore = (filePath: string, baseDir: string, ignorePatterns: string[]): boolean => {
      const relativePath = path.relative(baseDir, filePath);
      if (relativePath === '') return false; // Don't ignore the base directory itself

      return ignorePatterns.some(pattern => {
        const mm = new Minimatch(pattern, { dot: true });
        return mm.match(relativePath);
      });
    };

    const packDirectory = (dirPath: string, options: PackOptions = {}): FTYObject[] => {
      const ignorePatterns: string[] = [...(options.ignore || [])];

      if (options.useGitignore) {
        ignorePatterns.push(...loadGitignore(dirPath));
      }

      const processEntry = (entryPath: string, baseDirPath: string): FTYObject | null => {
        const stats = fs.statSync(entryPath);
        const entryName = path.basename(entryPath);

        // Always ignore .gitignore itself unless explicitly included
        if (entryName === '.gitignore' && options.useGitignore) {
            return null;
        }

        if (shouldIgnore(entryPath, baseDirPath, ignorePatterns)) {
          return null;
        }

        if (stats.isFile()) {
          const content = fs.readFileSync(entryPath, 'utf8');
          return { name: entryName, data: content };
        } else if (stats.isDirectory()) {
          const children = fs.readdirSync(entryPath)
            .map(childName => processEntry(path.join(entryPath, childName), baseDirPath))
            .filter(Boolean) as FTYObject[];
          return { name: entryName, data: children };
        }
        return null;
      };

      // The root directory itself is not an FTYObject, but its children are.
      // We return an array of FTYObjects for the direct contents of the specified dirPath.
      return fs.readdirSync(dirPath)
        .map(entryName => processEntry(path.join(dirPath, entryName), dirPath))
        .filter(Boolean) as FTYObject[];
    };

    const unpackDirectory = (ftyContent: FTYObject[], targetPath: string): void => {
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }

      ftyContent.forEach(item => {
        const itemPath = path.join(targetPath, item.name);
        if (typeof item.data === 'string') {
          // It's a file
          fs.writeFileSync(itemPath, item.data);
        } else if (Array.isArray(item.data)) {
          // It's a directory
          fs.mkdirSync(itemPath, { recursive: true });
          unpackDirectory(item.data, itemPath); // Recursively unpack
        }
      });
    };

    return {
      packDirectory,
      unpackDirectory,
      toYaml: (data: FTYObject[]) => yaml.dump(data),
      fromYaml: (yamlString: string) => yaml.load(yamlString) as FTYObject[]
    };
  };

  export default ftyUtils();
