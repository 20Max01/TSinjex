#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

// CLI argument parsing
const argv = yargs
  .option('src', {
    alias: 's',
    type: 'string',
    description: 'Directory to search for files',
    default: 'src',
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    description: 'Path to the output file',
    default: 'src/auto-imports.ts',
  })
  .option('pattern', {
    alias: 'p',
    type: 'string',
    description: 'File pattern to search for (e.g., .ts, .js)',
    default: '.ts',
  })
  .help()
  .argv;

// Fixed RegEx patterns for decorator detection
const SEARCH_PATTERNS = [
  /^@Register(?:<(.+)?>)?\(\s*["']{1}(.+)?["']{1}\s*,?\s*(true|false)?\s*\)/m, // Matches @Register(...)
  /^@RegisterInstance(?:<(.+)?>)?\(\s*["']{1}(.+)?["']{1}\s*,?\s*(.+)?\s*\)/m, // Matches @RegisterInstance(...)
];

const FILE_PATTERN = argv.pattern.startsWith('.') ? argv.pattern : `.${argv.pattern}`; // Ensure the pattern starts with a dot

/**
 * Recursively searches for all files in a directory matching the specified pattern.
 * @param {string} dirPath - The directory to search.
 * @returns {string[]} - List of matching files.
 */
function getAllFiles(dirPath) {
  let files = fs.readdirSync(dirPath);
  let arrayOfFiles = [];

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = arrayOfFiles.concat(getAllFiles(fullPath));
    } else if (file.endsWith(FILE_PATTERN)) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

/**
 * Filters files that contain at least one of the specified regex patterns.
 * @param {string[]} files - List of files to check.
 * @returns {string[]} - Files that contain at least one of the specified patterns.
 */
function findFilesWithPattern(files) {
  return files.filter((file) => {
    const content = fs.readFileSync(file, 'utf8');
    return SEARCH_PATTERNS.some((pattern) => pattern.test(content));
  });
}

/**
 * Generates an import file containing imports for all found files.
 * @param {string[]} files - List of relevant files.
 * @returns {string} - Generated import code.
 */
function generateImports(files) {
  return files.map((file) => `import '${file.replace(/\\/g, '/')}';`).join('\n') + '\n';
}

/**
 * Main function that executes the script.
 */
function main() {
  try {
    const srcDir = path.resolve(process.cwd(), argv.src);
    const outputFile = path.resolve(process.cwd(), argv.output);

    if (!fs.existsSync(srcDir)) {
      console.error(`❌ Error: The directory '${srcDir}' does not exist.`);
      process.exit(1);
    }

    const allFiles = getAllFiles(srcDir);
    const filesWithPattern = findFilesWithPattern(allFiles);

    if (filesWithPattern.length === 0) {
      console.log(`ℹ️ No ${FILE_PATTERN} files found matching the specified decorator patterns.`);
      return;
    }

    const importContent = generateImports(filesWithPattern);
    fs.writeFileSync(outputFile, importContent);

    console.log(`✅ Imports successfully generated: ${outputFile}`);
  } catch (error) {
    console.error('❌ An error occurred:', error.message);
    process.exit(1);
  }
}

main();
