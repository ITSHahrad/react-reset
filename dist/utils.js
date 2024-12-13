const fs = require('fs');
const path = require('path');

// Get the root directory synchronously
const rootDir = () => {
  try {
    const baseDir = path.parse(process.cwd());
    const rootDir = `${baseDir.dir}\\${baseDir.base}`;
    return rootDir;
  } catch (error) {
    throw new Error('Error reading directory path!\n' + error);
  }
};

// Read the directory synchronously
const readDir = () => {
  try {
    const baseDir = path.parse(process.cwd());
    const rootDir = `${baseDir.dir}\\${baseDir.base}`;
    const readDir = fs.readdirSync(rootDir);
    return readDir;
  } catch (error) {
    throw new Error('Error reading files in directory!\n' + error);
  }
};

// Check if a path is a file synchronously
const isFile = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return stats.isFile();
  } catch (error) {
    throw new Error('Error checking if path is a file!\n' + error);
  }
};

const srcPath = "src";

const reactPath = "react";

module.exports = { rootDir, readDir, isFile, srcPath, reactPath };
