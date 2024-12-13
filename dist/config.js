const fs = require("fs");
const { readDir, rootDir, reactPath } = require("./utils");
const colors = require("ansi-colors");
const prettier = require("prettier");

const config = {
  name: "reset.config.json",
  data: `{
  "ignore": [
    "components"
  ], 
  "data": [
    {
      "App.jsx": "import React from 'react';export default function App() { return <div>Hello, World!</div>; }",
      "index.css": "body { margin: 0; font-family: Arial, sans-serif; }",
      "main.jsx": "import React from 'react';import ReactDOM from 'react-dom';import App from './App';ReactDOM.render(<App />, document.getElementById('root'));",
      "App.css": "#root { max-width: 1280px; margin: 0 auto; padding: 2rem; text-align: center; } .logo { height: 6em; padding: 1.5em; will-change: filter; transition: filter 300ms; } .logo:hover { filter: drop-shadow(0 0 2em #646cffaa); } .logo.react:hover { filter: drop-shadow(0 0 2em #61dafbaa); } @keyframes logo-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @media (prefers-reduced-motion: no-preference) { a:nth-of-type(2) .logo { animation: logo-spin infinite 20s linear; } } .card { padding: 2em; } .read-the-docs { color: #888; }"
    }
  ]
}
`
};

const createConfig = async () => {
  const configFile = getConfig();
  if (!configFile.length) {
    // Write the config file
    fs.writeFileSync(config.name, config.data, { encoding: "utf-8" });
    console.log(
      `${colors.blue(config.name)} ${colors.green("created in root directory!")}`
    );

    // Parse the config data
    const parsedConfig = JSON.parse(config.data);

    // Write the files defined in the "data" section of the config
    const filesToCreate = parsedConfig.data[0];

    fs.mkdirSync(`${rootDir()}\\${reactPath}`, {});

    Object.keys(filesToCreate).forEach(async (fileName) => {
      let fileContent = filesToCreate[fileName];

      if (fileName.endsWith(".jsx") || fileName.endsWith(".js") || fileName.endsWith(".css")) {
        // Format using Prettier
        fileContent = await prettier.format(fileContent, {
          semi: true,
          singleQuote: true,
          jsxBracketSameLine: true,
          trailingComma: "es5",
          parser: fileName.endsWith(".css") ? "css" : "babel", // Specify CSS parser for CSS files
        });
      }

      // Write the file
      fs.writeFileSync(`${reactPath}\\${fileName}`, fileContent, { encoding: "utf-8" });
      console.log(`${colors.blue(fileName)} ${colors.green("created in " + reactPath + " directory!")}`);
    });

    return;
  }

  console.log(colors.red("You already have the react reset config file!"));
};

const getConfig = () => {
  const read = readDir();
  return read.filter((file) => file === config.name);
};

const readConfig = () => {
  const configFile = getConfig();
  if (!configFile.length) return null;

  return fs.readFileSync(configFile[0], { encoding: "utf-8" });
};

module.exports = { createConfig, readConfig, getConfig };
