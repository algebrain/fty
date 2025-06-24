import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { Minimatch } from 'minimatch';

export type FTYObject = {
  name: string;
  data: string | FTYObject[];
};

export type PackOptions = {
  ignore?: string[];
  useGitignore?: boolean;
};

const loadGitignore = (dirPath: string): string[] => {
  const gitignorePath = path.join(dirPath, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    return fs.readFileSync(gitignorePath, 'utf8')
      .split(/\r?\n/)
      .filter(line => line.trim() !== '' && !line.startsWith('#'))
      .map(line => {
          if (line.startsWith('/')) return line.substring(1);
          return line;
      });
  }
  return [];
};

const shouldIgnore = (entryPath: string, baseDir: string, ignorePatterns: string[]): boolean => {
  let relativePath = path.relative(baseDir, entryPath);
  if (relativePath === '') return false;

  const stats = fs.statSync(entryPath);
  if (stats.isDirectory() && !relativePath.endsWith(path.sep)) {
      relativePath += path.sep;
  }

  return ignorePatterns.some(pattern => {
      const mm = new Minimatch(pattern, { dot: true, matchBase: true });
      return mm.match(relativePath);
  });
};

export const packDirectory = (dirPath: string, options: PackOptions = {}): FTYObject[] => {
  const ignorePatterns: string[] = [...(options.ignore || [])];

  if (options.useGitignore) {
    ignorePatterns.push(...loadGitignore(dirPath));
  }

  const processEntry = (entryPath: string, baseDirPath: string): FTYObject | null => {
    const stats = fs.statSync(entryPath);
    const entryName = path.basename(entryPath);

    if (entryName === '.gitignore' && options.useGitignore) {
        return null;
    }

    if (shouldIgnore(entryPath, baseDirPath, ignorePatterns)) {
      return null;
    }

    if (stats.isFile()) {
      let content = fs.readFileSync(entryPath, 'utf8');
      content = content.replace(/\r\n/g, '\n');
      return { name: entryName, data: content };
    } else if (stats.isDirectory()) {
      const children = fs.readdirSync(entryPath)
        .map(childName => processEntry(path.join(entryPath, childName), baseDirPath))
        .filter(Boolean) as FTYObject[];
      return { name: entryName, data: children };
    }
    return null;
  };

  return fs.readdirSync(dirPath)
    .map(entryName => processEntry(path.join(dirPath, entryName), dirPath))
    .filter(Boolean) as FTYObject[];
};

export const unpackDirectory = (ftyContent: FTYObject[], targetPath: string): void => {
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  ftyContent.forEach(item => {
    const itemPath = path.join(targetPath, item.name);
    if (typeof item.data === 'string') {
      fs.writeFileSync(itemPath, item.data);
    } else if (Array.isArray(item.data)) {
      fs.mkdirSync(itemPath, { recursive: true });
      unpackDirectory(item.data, itemPath);
    }
  });
};

export const toYaml = (data: FTYObject[]) => yaml.dump(data, {
  styles: {
    'tag:yaml.org,2002:str': 'literal'
  },
  lineWidth: -1,
  noRefs: true
});

export const fromYaml = (yamlString: string) => yaml.load(yamlString) as FTYObject[];
