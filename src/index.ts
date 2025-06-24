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
        .filter(line => line.trim() !== '' && !line.startsWith('#'))
        .map(line => { // Normalizing patterns for Minimatch
            if (line.startsWith('/')) return line.substring(1); // Remove leading slash for root patterns
            return line;
        });
    }
    return [];
  };

  const shouldIgnore = (entryPath: string, baseDir: string, ignorePatterns: string[]): boolean => {
    // Получаем относительный путь к элементу
    let relativePath = path.relative(baseDir, entryPath);

    // Если это корневая директория, которую мы передали, не игнорируем ее саму.
    // Это важно, так как baseDir может быть тем, что мы хотим запаковать.
    if (relativePath === '') return false;

    // Для директорий Minimatch лучше работает, если паттерн заканчивается на '/',
    // или если мы проверяем соответствие "folder/" и "folder".
    // Добавляем '/' к относительному пути, если это директория
    const stats = fs.statSync(entryPath);
    if (stats.isDirectory() && !relativePath.endsWith(path.sep)) {
        relativePath += path.sep;
    }

    return ignorePatterns.some(pattern => {
        // Добавляем опцию `dot: true` для обработки скрытых файлов/папок (.git, .vscode и т.д.)
        // `matchBase: true` полезен, когда паттерн не содержит слэшей
        const mm = new Minimatch(pattern, { dot: true, matchBase: true });
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

      // Игнорируем .gitignore, если используется опция useGitignore
      if (entryName === '.gitignore' && options.useGitignore) {
          return null;
      }

      // Проверка на игнорирование до обработки
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

    // Собираем элементы непосредственно из указанной dirPath
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