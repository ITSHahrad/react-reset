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
      "App.jsx": "import { useState } from 'react';function App(){const [count,setCount]=useState(0);return(<><div><a href='https://github.com/ITSHahrad/react-restart' target='_blank'><img src='https://i.imgur.com/y51KqAy.png' className='logo' alt='React Restart Logo'/></a></div><h1>Vite + React (Restart)</h1><div><button onClick={()=>setCount(count=>count+1)}>Love react restart {count} times 💕 </button><p>Edit <code>src/App.jsx</code> and save.</p></div><p>Click on the React Restart icon to know more!</p></>);}export default App;",
      "index.css": "body{min-width:100%;min-height:100vh;margin:0;font-family:Arial,sans-serif;background-color:#161518;color:white;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}.logo{width:200px;transition:filter 1s}.logo:hover{filter:drop-shadow(0 0 2rem skyblue)}button{background-color:transparent;color:white;font-family:'Franklin Gothic Medium','Arial Narrow',Arial,sans-serif;font-weight:600;font-size:20px;border:2px solid white;padding:10px;border-radius:10px;cursor:pointer;transition:0.3s linear}button:hover{background-color:white;color:black}",
      "main.jsx": "import React from'react';import ReactDOM from'react-dom';import App from'./App';import'./index.css';ReactDOM.render(<App/>,document.getElementById('root'));"
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
